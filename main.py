from typing import Annotated
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select

# define Note schema
class Note(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    text: str
    dateCreated: str

# configure sqlite connection details
sqlite_database_file = "test.db"
sqlite_url = f"sqlite:///{sqlite_database_file}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

# create db if it does not exist
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# generate one session per request
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

# initialize the app
app = FastAPI()

# allow localhost origins for testing
origins = [
    "null", # for local dev only to allow frontend access from index.html
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# retrieve all notes
@app.get("/notes/")
def get_notes(session: SessionDep) -> list[Note]:
    notes = session.exec(select(Note)).all()
    return notes

# create one note
@app.post("/notes/")
def create_note(note: Note, session: SessionDep) -> Note:
    session.add(note)
    session.commit()
    session.refresh(note)
    return note