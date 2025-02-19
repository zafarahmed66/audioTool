from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import matchering as mg
import os



app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/processed", StaticFiles(directory="processed"), name="processed")
PROCESSED_DIR = "processed"

os.makedirs(PROCESSED_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/process/")
async def process_audio(request: Request):
    data = await request.json()
    mg.process(
    target=data["songUrl"],
    reference="reference.wav",
    results=[
        mg.pcm16(f"{PROCESSED_DIR}/my_song_master_16bit.wav"),
        mg.pcm24(f"{PROCESSED_DIR}/my_song_master_24bit.wav"),
    ],
    )   

    return {"processed_file": f"/processed/my_song_master_24bit.wav"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
