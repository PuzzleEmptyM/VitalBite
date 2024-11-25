import sys
import json

# Get the UID passed as an argument
uid = sys.argv[1]

if __name__ == "__main__":
    # Generate a response based on the UID (for demonstration purposes)
    response = {
        "uid": uid,
        "message": f"Hello from Python, user {uid}",
        "status": "success"
    }

    # Return the response as a JSON string
    print(json.dumps(response))
