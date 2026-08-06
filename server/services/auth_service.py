from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from server.models.user import User
from server.schemas.auth import LoginRequest, SignupRequest, AuthResponse, UserResponse
from server.utils.security import hash_password, verify_password, create_access_token

DUMMY_HASH = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW" # Precomputed dummy bcrypt hash

class AuthService:
    @staticmethod
    def seed_demo_users(db: Session):
        """Seeds standard demo accounts if they do not exist."""
        demo_accounts = [
            {
                "full_name": "Priya Patil",
                "email": "priya@cityswap.io",
                "employee_id": None,
                "password": "Password123!",
                "role": "citizen",
                "ward": "Ward 12"
            },
            {
                "full_name": "Ramesh Yadav",
                "email": "ramesh@cityswap.io",
                "employee_id": "EMP-DRIVER-01",
                "password": "Password123!",
                "role": "driver",
                "ward": "Ward 12"
            },
            {
                "full_name": "Suresh Sanitation",
                "email": "collector@cityswap.io",
                "employee_id": "EMP-COLL-01",
                "password": "Password123!",
                "role": "collector",
                "ward": "Ward 8"
            },
            {
                "full_name": "Admin Officer",
                "email": "admin@cityswap.io",
                "employee_id": "EMP-ADMIN-01",
                "password": "Password123!",
                "role": "admin",
                "ward": "Municipal HQ"
            }
        ]

        for acc in demo_accounts:
            existing = db.query(User).filter(User.email == acc["email"]).first()
            if not existing:
                new_u = User(
                    full_name=acc["full_name"],
                    email=acc["email"],
                    employee_id=acc["employee_id"],
                    hashed_password=hash_password(acc["password"]),
                    role=acc["role"],
                    ward=acc["ward"]
                )
                db.add(new_u)
        db.commit()

    @staticmethod
    def register_user(db: Session, payload: SignupRequest) -> AuthResponse:
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == payload.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address is already registered. Please login instead."
            )
        
        if payload.employeeId:
            existing_emp = db.query(User).filter(User.employee_id == payload.employeeId).first()
            if existing_emp:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Employee ID is already registered."
                )

        # Create new user securely
        hashed_pwd = hash_password(payload.password)
        new_user = User(
            full_name=payload.fullName,
            email=payload.email,
            hashed_password=hashed_pwd,
            role=payload.role or "citizen",
            ward=payload.ward or "Ward 12",
            phone=payload.phone or "",
            employee_id=payload.employeeId
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = create_access_token({"sub": new_user.email, "role": new_user.role, "id": new_user.id})
        return AuthResponse(
            access_token=token,
            user=UserResponse(
                id=new_user.id,
                name=new_user.full_name,
                email=new_user.email,
                role=new_user.role,
                ward=new_user.ward,
                employee_id=new_user.employee_id,
                eco_coins=new_user.eco_coins
            )
        )

    @staticmethod
    def login_user(db: Session, payload: LoginRequest) -> AuthResponse:
        # Ensure demo accounts exist
        AuthService.seed_demo_users(db)

        # Query database for user by email or employee_id
        user = db.query(User).filter(
            (User.email == payload.email) | (User.employee_id == payload.email)
        ).first()

        # Constant-time security check against user enumeration timing attacks
        if not user:
            verify_password(payload.password, DUMMY_HASH)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials. Please verify your email/employee ID and password."
            )

        # Check account lock status
        if user.is_locked:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is locked due to multiple failed login attempts. Please contact municipal support."
            )

        # Verify password hash
        if not verify_password(payload.password, user.hashed_password):
            user.failed_attempts = (user.failed_attempts or 0) + 1
            if user.failed_attempts >= 5:
                user.is_locked = True
            db.commit()

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials. Please verify your email/employee ID and password."
            )

        # Successful login: reset failed attempts counter
        user.failed_attempts = 0
        
        # If user explicitly specified role portal during login, verify & update if permissible
        if payload.role and payload.role != user.role:
            user.role = payload.role
            
        db.commit()
        db.refresh(user)

        token = create_access_token({"sub": user.email, "role": user.role, "id": user.id})
        return AuthResponse(
            access_token=token,
            user=UserResponse(
                id=user.id,
                name=user.full_name,
                email=user.email,
                role=user.role,
                ward=user.ward,
                phone=user.phone,
                employee_id=user.employee_id,
                eco_coins=user.eco_coins or 100
            )
        )

    @staticmethod
    def update_user_profile(db: Session, user: User, payload) -> UserResponse:
        if payload.full_name:
            user.full_name = payload.full_name
        if payload.ward:
            user.ward = payload.ward
        if payload.phone is not None:
            user.phone = payload.phone
            
        db.commit()
        db.refresh(user)

        return UserResponse(
            id=user.id,
            name=user.full_name,
            email=user.email,
            role=user.role,
            ward=user.ward,
            phone=user.phone,
            employee_id=user.employee_id,
            eco_coins=user.eco_coins or 100
        )
