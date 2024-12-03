import functions_framework
import openai
import json
import pg8000
import os
import sys
import uuid

# OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Database connection parameters
DATABASE_USER = os.getenv("POSTGRES_USER")
DATABASE_PASS = os.getenv("POSTGRES_PASSWORD")
DATABASE_DB = os.getenv("POSTGRES_DATABASE")
DATABASE_HOST = os.getenv("POSTGRES_HOST")

# Get info from databases
def get_db_connection():
    """ Creates a Database connection """
    conn = pg8000.connect(
        user=DATABASE_USER,
        password=DATABASE_PASS,
        host=DATABASE_HOST,
        database=DATABASE_DB
    )
    return conn

def get_user_diet(uid, cursor):
    """
    Retrieves the User Diet Restrictions
    
    Inputs:
    uid - user ID (string or UUID object)
    cursor - database cursor object

    Returns:
    String of all associated dietary requirements
    """
    try:
        # Ensure the UID is a UUID object
        if isinstance(uid, str):
            uid = uuid.UUID(uid)

        query = """
            SELECT dt."dietName"
            FROM userpreference as up
            JOIN diettype as dt ON up."dietId" = dt."dietId" 
            WHERE up.uid = %s;
        """
        cursor.execute(query, (str(uid),))  # Use parameterized queries
        diets = cursor.fetchall()
        diet_list = [diet[0] for diet in diets]
        return ', '.join(diet_list)
    except Exception as e:
        print(f"Database error: {e}")
        return ""

# Classify the message
def classify_food(food, user_diet, client):
    classification_rules = f"""
    You are an expert in {user_diet}
    You are to classify the user's supplied food with either safe, unsafe, or caution
    - "safe": If the food is generally safe to eat with all of the user's dietary restrictions, ex. Broccoli is safe for gluten free
    - "unsafe": If the food is unsafe to eat with any of the user's dietary restrictions, ex. Breqad is unsafe for gluten free
    - "caution": If the food is potentially okay with the user's dietary restrictions, but we need to exercise caution, ex. french fries are gluten free technically but should be avoided at restaurants because of cross contamination in the oil 

    Respond with only one of the above categories.
    """

    base_input = """Write one sentence spelling the food correctly. 
                    If the food is safe, write 'Food name is generally safe to consume.'
                    If the food is unsafe, write 'Food name is generally unsafe to consume.'
                    If the food is caution, write 'Caution is advised while eating food name.'"""

    info_input = """Write up to two sentences with clarification about the safety of this food.
                    If the food is safe but there are circumstances when it is unsafe, clarify that here.
                    If the food is unsafe, provide some context.
                    If the food is caution, carlify why. For example french fries are gluten free in theory but many restaurants fry them in the same oil as other gluten containing foods."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", 
            messages=[
                {"role": "system", "content": classification_rules},
                {"role": "assistant", "content": f"Dietary restrictions: {user_diet}"},
                {"role": "user", "content": food}
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "food_schema",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "category": {
                                "description": "One word response, either safe, unsafe, or caution",
                                "type": "string"
                            },
                            "base_sentence": {
                                "description": base_input,
                                "type": "string"
                            },
                            "info": {
                                "description": info_input,
                                "type": "string"
                            },
                            "additionalProperties": False
                    }
                }
            }},
            n=1,
            stop=None,
            temperature=0
        )
        food_safety = json.loads(response.choices[0].message.content)
        print(food_safety)
        return food_safety
    except Exception as e:
        print(f"Classification error: {e}", file=sys.stderr)
        return None

@functions_framework.http
def food_check(request):
    """
    Checks if a food or ingredient are safe to eat for a user with specific
    dietary conditions
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get JSON payload from the HTTP request
        data = request.get_json()
        if not data:
            raise ValueError("No JSON payload provided")

        uid = data.get("uid")
        food = data.get("message")

        if not uid or not food:
            raise ValueError("Missing 'uid' or 'message' in request payload")

        # # Connect to OpenAI
        client = openai.OpenAI()

        # Replace with userId = uid
        userId = uid

        user_diet = get_user_diet(userId, cursor)

        # # Replace with user_message = message
        food_inquiry = food

        food_safety = classify_food(food_inquiry, user_diet, client)
        response = {
            "uid": str(userId),
            "classify": food_safety['category'],
            "base": food_safety['base_sentence'],
            "info": food_safety['info'],
            "diet": user_diet,
            "status": "success"
        }
        # response = { "status": "success" }
        conn.close()
        # return food_safety
        return json.dumps(response), 200
        

    except Exception as e:
        conn.close()
        error_response = {
            "error": str(e),
            "status": "error"
        }
        return json.dumps(error_response), 400
