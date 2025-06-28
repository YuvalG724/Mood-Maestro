from deepface import DeepFace
import cv2
import pyaudio
import json
from vosk import Model as VoskModel, KaldiRecognizer

vosk_model = VoskModel("vosk_model")  
recognizer = KaldiRecognizer(vosk_model, 16000)
frames=25
def wait_for_wake_word(keywords="Hello"):
    pa = pyaudio.PyAudio()
    stream = pa.open(format=pyaudio.paInt16, channels=1,rate=16000, input=True, frames_per_buffer=8000)
    stream.start_stream()
    print("Waiting for wake word... (say: Hello)")
    while True:
        data = stream.read(4000, exception_on_overflow=False)
        if recognizer.AcceptWaveform(data):
            result = json.loads(recognizer.Result())
            text = result.get("text", "").lower()
            print("Listening: ", text)
            if any(word in text for word in keywords):
                print("Wake word detected!")
                break
            else:
                print("Waiting for keyword...")

def detect_emotion():
    recognized_count=0
    prev_emotion=""
    confirmed_emotion=""
    wait_for_wake_word(("hello",))
    cap = cv2.VideoCapture(0)
    print("Starting webcam. Press ESC to exit.")
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        try:
            result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            emotion = result[0]['dominant_emotion']
            if emotion==prev_emotion:
                recognized_count+=1
            else:
                recognized_count=0
                prev_emotion=emotion
            if recognized_count>=frames:
                if emotion=="neutral":
                    emotion="calm"
                if confirmed_emotion!=emotion:
                    confirmed_emotion=emotion
                print("Confirmed emotion: ",confirmed_emotion)
                recognized_count=0
                prev_emotion=""
                break
            cv2.putText(frame,emotion, (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
        except Exception as e:
            print("DeepFace Error:", e)
        cv2.imshow("Emotion Detection", frame)
        if cv2.waitKey(1) & 0xFF == 27:
            break
    cap.release()
    cv2.destroyAllWindows()
    return confirmed_emotion
if __name__ == "__main__":
    final_emotion = detect_emotion()