#!/usr/bin/env python3
import openai
import json
import pg8000
from dotenv import load_dotenv
import os


# Load environment variables
load_dotenv(dotenv_path="./.env")

# OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Database connection parameters
DATABASE_URL = os.getenv("POSTGRES_URL")
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
    
    Inputs:\\
    uid - user Id\\
    cursor - database cursor object

    Returns:\\
    String of all assoicated dietary requirements
    """

    try:
        query = f"""
                SELECT dt."dietName" FROM userpreference as up
                JOIN diettype as dt ON up."dietId" = dt."dietId" 
                WHERE up.uid = {uid} 
                """
        cursor.execute(query)
        diets = cursor.fetchall()
        diet_list = [diet[0] for diet in diets]
        return ', '.join(diet_list)
    except Exception as e:
        print(f"Database error: {e}")
        return ""
    

def get_conversation_context(uid, cursor):
    """ 
    Gets context to give to chatbot 
    
    Inputs:\\
    uid - user Id\\
    cursor - database cursor object

    Returns:\\
    List of 10 most previous questions and answers formatted to give
    chatbot correct context
    """

    try:
        query = f"""
            SELECT "userQuestion", "chatResponse"
            FROM context
            WHERE uid = {uid} AND "recipeId" IS NULL
            ORDER BY timestamp DESC
            LIMIT 10;
        """
        cursor.execute(query)
        context = cursor.fetchall()
        # Flatten the context into a list of messages
        messages = []
        for user_q, chat_resp in reversed(context):
            messages.append({"role": "user", "content": user_q})
            messages.append({"role": "assistant", "content": chat_resp})
        return messages
    except Exception as e:
        print(f"Database error: {e}")
        return []
    

def get_user_recipes(uid, cursor):
    """
    Retrieves the previous user recipes
    
    Inputs:\\
    uid - user Id\\
    cursor - database cursor object

    Returns:\\
    List of previous recipes names for context
    """

    try:
        query = f"""
            SELECT "recipeName"
            FROM recipe
            WHERE uid = {uid}; 
        """
        cursor.execute(query)
        recipes = cursor.fetchall()
        recipe_names = [recipe[0] for recipe in recipes]
        return recipe_names
    except Exception as e:
        print(f"Database error: {e}")
        return []


# Classify the message
def classify_message(user_question, user_diet, context, client):
    classification_rules = """
    You are to classify the user's request into one of the following categories:
    - "recipe": If the user is asking for a recipe.
    - "lifestyle": If the user is seeking lifestyle tips related to their diet.
    - "general": If the user needs clarification about previous prompts or anything that would not be a lifestyle tip.
    - "not applicable": If the request is unrelated to diet or lifestyle.

    Respond with only one of the above categories.
    """

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini", 
            messages=[
                {"role": "system", "content": classification_rules},
                {"role": "assistant", "content": f"Dietary preferences: {user_diet}, context: {context}"},
                {"role": "user", "content": user_question}
            ],
            max_tokens=5,
            n=1,
            stop=None,
            temperature=0
        )
        classification = completion.choices[0].message.content.strip().lower()
        return classification
    except Exception as e:
        print(f"Classification error: {e}")
        return None
    

# Generate Responses

# Store To Context Table
def store_context(userId, user_question, chat_response, classify, class_ID, conn):
    """
    Stores the generated recipe into Postgres Database

    Inputs:\\
    userId - userId for adding to DB\\
    user_question - prompt from the user to add to db\\
    chat_response - formatted response for the context db\\
    classify - the type of chat that was used\\
    class_ID - either a lifestyle tip id or a recipe id\\
    conn - connection to the database
    """
    tip_id = None
    recipe_id = None

    if classify == "recipe":
        recipe_id = class_ID
    elif classify == "lifestyle":
        tip_id = class_ID

    try:
        cursor = conn.cursor()

        query = """
            INSERT INTO context (uid, "tipId", "recipeId", "userQuestion", "chatResponse")
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (userId, tip_id, recipe_id, user_question, chat_response))

        conn.commit()
        return None
    except Exception as e:
        print(f"Database error: {e}")


# Store and Create New Recipes
def store_recipe(userId, recipe, conn):
    """
    Stores the generated recipe into Postgres Database

    Inputs:\\
    userId - userId, used for key to store\\
    recipe - new recipe created by chatbot to store to recipe db\\
    conn - connection to the db

    Returns:\\
    recipe_id - id to connect to the context table
    """

    try:
        cursor = conn.cursor()
        
        name = recipe['Recipe']
        ingreds = json.dumps(recipe['Ingredients'])
        prep_time = recipe['Prep Time']
        instruct = json.dumps(recipe['Instructions'])

        query = """
            INSERT INTO recipe (uid, "recipeName", ingredients, instructions, "prepTime")
            VALUES (%s, %s, %s, %s, %s)
            RETURNING "recipeId";
        """
        cursor.execute(query, (userId, name, ingreds, instruct, prep_time))

        recipe_id = cursor.fetchone()[0]
        print(recipe_id)
        conn.commit()
        return recipe_id
    except Exception as e:
        print(f"Database error: {e}")
        return None


def generate_recipe(user_message, user_diet, previous_recipes, client, userId, conn):
    """
    Generates a new recipe for the user

    Inputs:\\
    user_message - prompt from the user\\
    user_diet - dietary restrictions of the user from database\\
    previous_recipes - previous recipes to not repeat, from DB\\
    client - chatGPT client object\\
    userId - userId\\
    conn - connection to database

    Returns:\\
    JSON with the output to return to the user.
    """
    response = client.chat.completions.create(
    model="gpt-4o-mini",  
    messages=[
        {
            "role": "system",
            "content": """You give recipes given certain dietary conditions. 
            You must make sure the recipe is not repeated.
            You must make sure the recipe does not recommend anything the user cannot eat
            with their dietary restrictions"""
        },
        {
            "role": "assistant",
            "content": f"""Dietary restrictions: User has the following diet requirements {user_diet},
                        Previous Recipes: {previous_recipes}"""
        },
        {
            "role": "user",
            "content": user_message
        }
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "recipe_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "Recipe": {
                        "description": "The name of the recipe",
                        "type": "string"
                    },
                    "Ingredients": {
                        "description": "list of ingredients with measurements if needed",
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "Prep Time": {
                        "description": "time in minutes to prepare and cook this recipe",
                        "type": "integer"
                    },
                    "Instructions": {
                        "description": "Instructions to create this recipe, stored as JSON",
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "additionalProperties": False
            }
        }
    }}
    )

    # Print the response
    print(response.choices[0].message.content)
    recipe = json.loads(response.choices[0].message.content)
    class_ID = store_recipe(userId, recipe, conn)

    classify = "recipe"
    chat_response = recipe["Recipe"]

    store_context(userId, user_message, chat_response, classify, class_ID, conn)
    response = {"uid": userId,
                "message": f"Recipe added to Recipe Book: {recipe['Recipe']}",
                "status": "success"}
    return(response)


# Store and and create lifestyle tips
def store_lifestyle_tip(userId, tip, conn):
    """
    Stores the generated Lifestyle Tip into Postgres Database

    Inputs:\\
    userId - userId, used for key to store\\
    tip - new lifestyle tip created by chatbot to store to recipe db\\
    conn - connection to the db

    Returns:\\
    tip_id - id to connect to the context table
    """

    try:
        cursor = conn.cursor()
        
        summary = tip["summary"]
        full_tip = tip["full_tip"]

        query = """
            INSERT INTO tip (uid, summary, tip)
            VALUES (%s, %s, %s)
            RETURNING "tipId";
        """
        cursor.execute(query, (userId, summary, full_tip))

        tip_id = cursor.fetchone()[0]
        print(tip_id)
        conn.commit()
        return tip_id
    except Exception as e:
        print(f"Database error: {e}")
        return None

def generate_lifestyle_tip(user_message, user_diet, context, client, userId, conn):
    """
    Generates a new lifestyle tip for the user

    Inputs:\\
    user_message - prompt from the user\\
    user_diet - dietary restrictions of the user from database\\
    context- context for the chatbot, previous chat messages and answers\\
    client - chatGPT client object\\
    userId - userId\\
    conn - connection to database

    Returns:\\
    JSON with the output to return to the user.
    """
    response = client.chat.completions.create(
    model="gpt-4o-mini",  
    messages=[
        {
            "role": "system",
            "content": """You give lifestyle tips to the user given certain dietary conditions. 
            The lifestyle tips will be relevent to prompt the user supplies.
            The tip will have a very concise summary, then if necessary a longer explanation.
            """
        },
        {
            "role": "assistant",
            "content": f"""Dietary restrictions: User has the following diet requirements {user_diet},
                        Chat Context: {context}"""
        },
        {
            "role": "user",
            "content": user_message
        }
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "tips_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "summary": {
                        "description": "A very concise summary of the tip",
                        "type": "string"
                    },
                    "full_tip": {
                        "description": "A longer explanation of the lifestyle tip",
                        "type": "string"
                    },
                    "additionalProperties": False
            }
        }
    }}
    )

    # Print the response
    print(response.choices[0].message.content)
    tip = json.loads(response.choices[0].message.content)
    class_ID = store_lifestyle_tip(userId, tip, conn)

    classify = "lifestyle"
    chat_response = tip["summary"]
    full_tip = tip["full_tip"]

    store_context(userId, user_message, chat_response, classify, class_ID, conn)
    response = {"uid": userId,
                "message": f"{chat_response} \n\n {full_tip} \n\n Lifestyle tip added to Lifestyle Tips Cards",
                "status": "success"}
    return(response)


# Store and create general advice
def generate_general(user_message, user_diet, context, client, userId, conn):
    """
    Generates a new general tip for the user

    Inputs:\\
    user_message - prompt from the user\\
    user_diet - dietary restrictions of the user from database\\
    context- context for the chatbot, previous chat messages and answers\\
    client - chatGPT client object\\
    userId - userId\\
    conn - connection to database

    Returns:\\
    JSON with the output to return to the user.
    """
    response = client.chat.completions.create(
    model="gpt-4o-mini",  
    messages=[
        {
            "role": "system",
            "content": """You give general tips to the user given certain dietary conditions. 
            The general tips could just be clarification about previous user questions.
            You will answer the user's prompt
            """
        },
        {
            "role": "assistant",
            "content": f"""Dietary restrictions: User has the following diet requirements {user_diet},
                        Chat Context: {context}"""
        },
        {
            "role": "user",
            "content": user_message
        }
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "general_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "general_tip": {
                        "description": "Answer to the user's query",
                        "type": "string"
                    },
                    "additionalProperties": False
            }
        }
    }}
    )

    # Print the response
    print(response.choices[0].message.content)
    general_tip = json.loads(response.choices[0].message.content)

    classify = "none"
    chat_response = general_tip["general_tip"]
    class_ID = None

    store_context(userId, user_message, chat_response, classify, class_ID, conn)
    response = {"uid": userId,
                "message": f"{chat_response}",
                "status": "success"}
    return(response)


def generate_response(classification, userId, user_message, user_diet, context, recipes, client, conn):
    """
    Generates a chat response bassed on the previous classification

    Inputs:\\
    classification - based on the classify message function\\
    userId - userId\\
    user_message - prompt from the user\\
    user_diet - dietary restrictions of the user from database\\
    context - context to give Chat, from DB\\
    recipes - previous recipes to not repeat, from DB\\
    client - chatGPT client object\\
    conn - connection to database

    Returns:\\
    JSON with the output to return to the user.
    """

    if classification == "not applicable":
        response = {"uid": userId,
                    "message": "I'm sorry, but I can only assist with dietary and lifestyle-related questions.",
                    "status": "success"}

        return response

    # Adjust the prompt based on classification
    if classification == "recipe":
        response = generate_recipe(user_message, user_diet, recipes, client, userId, conn)
        return response
    elif classification == "lifestyle":
        response = generate_lifestyle_tip(user_message, user_diet, context, client, userId, conn)
        return response
    elif classification == "general":
        response = generate_general(user_message, user_diet, context, client, userId, conn)
        return response
    else:
        response = response = {"uid": userId,
                "message": "I'm sorry, I didn't understand your request.",
                "status": "success"}
        return response
    

if __name__=="__main__":
    # Connect to Database
    conn = get_db_connection()
    cursor = conn.cursor()

    # Connect to OpenAI
    client = openai.OpenAI()

    userId = 1

    try:
        user_diet = get_user_diet(userId, cursor)
        context = get_conversation_context(userId, cursor)
        recipes = get_user_recipes(userId, cursor)

        user_message = "Can you give me an example of communicating cleary to a waiter?"

        classify = classify_message(user_message, user_diet, context, client)
        print(classify)
        response = generate_response(classify, userId, user_message, user_diet, context, recipes, client, conn)
        # recipe = generate_recipe(user_message, user_diet, recipes, client, userId, conn)
        print(response)
        
        # print(response)
        # print(user_diet)
        # print(context)
        # print(recipes)

    except Exception as e:
        print("Exception:" + e)

    finally:
        conn.close()
