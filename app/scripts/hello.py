import sys
import json
# import openai
# import pg8000
import os
# from dotenv import load_dotenv # local testing


if __name__ == "__main__":

    try:
        # load_dotenv() # local testing

        # Debug: Log that the script has started (to stderr)
        print("Debug: Script started", file=sys.stderr, flush=True)

        # Read JSON input from stdin
        input_data = sys.stdin.read()
        print(f"Debug: Received input: {input_data}", file=sys.stderr, flush=True)

        data = json.loads(input_data)
        uid = data.get("uid")
        message = data.get("message")

        # Simulate environment variable access
        # DATABASE_USER = os.getenv("POSTGRES_USER", "default_user")
        # print(f"Debug: DATABASE_USER: {DATABASE_USER}", file=sys.stderr, flush=True)

        # Create JSON response
        # response = {
        #     "uid": uid,
        #     "user": f"DB User ID: {DATABASE_USER}",
        #     "user_message": f"Test User message: {message}",
        #     "status": "success"
        # }

        response = {
            "uid": uid,
            "user_message": f"Test User message: {message}",
            "status": "success"
        }

        # Print the JSON response to stdout
        print(json.dumps(response), flush=True)

    except Exception as e:
        # Log the exception to stderr
        print(f"Exception: {e}", file=sys.stderr, flush=True)

        # Return a failure response
        response = {
            "uid": None,
            "Exception": str(e),
            "status": "failure"
        }
        print(json.dumps(response), flush=True)

        
    # try:

    #     # Read JSON input from stdin
    #     input_data = sys.stdin.read()
    #     data = json.loads(input_data)
    #     uid = data.get("uid")
    #     message = data.get("message")

    #     # load_dotenv() # local testing

    #     DATABASE_USER = os.getenv("POSTGRES_USER")
    #     DATABASE_PASS = os.getenv("POSTGRES_PASSWORD")
    #     DATABASE_DB = os.getenv("POSTGRES_DATABASE")
    #     DATABASE_HOST = os.getenv("POSTGRES_HOST")

    #     # conn = pg8000.connect(
    #     # user=DATABASE_USER,
    #     # password=DATABASE_PASS,
    #     # host=DATABASE_HOST,
    #     # database=DATABASE_DB
    #     # )
    #     # cursor = conn.cursor()

    #     # try:
    #     #     cursor.execute("SELECT * FROM context;")
    #     #     rows = cursor.fetchall()

    #     # except Exception as e:
    #     #     print("Exception:" + e)

    #     # conn.close()
    #     # Generate a response based on the UID (for demonstration purposes)
    #     # response = {
    #     #     "uid": uid,
    #     #     "message": f"Hello from Python, user {rows}",
    #     #     "user": f"\nDB User ID: {DATABASE_USER}\n",
    #     #     "user_message": f"Test User message: {message}",
    #     #     "status": "success"
    #     # }

    #     response = {
    #         "uid": uid,
    #         "user": f"\nDB User ID: {DATABASE_USER}\n",
    #         "user_message": f"Test User message: {message}",
    #         "status": "success"
    #     }

    #     # Return the response as a JSON string
    #     print(json.dumps(response))

    # except Exception as e:
    #     response = {
    #         "uid": uid,
    #         "Exception": f"Hello from Python, user {e}",
    #         "status": "success"
    #     }

    #     print(json.dumps(response))
