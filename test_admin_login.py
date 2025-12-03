import hashlib
import json
import urllib.request
import urllib.error

def compute_sha256(password):
    """Compute SHA256 hash of the password"""
    return hashlib.sha256(password.encode()).hexdigest()

def test_login():
    # Compute hash
    password = "admin123"
    password_hash = compute_sha256(password)
    print(f"Password: {password}")
    print(f"SHA256 Hash: {password_hash}\n")
    
    # Prepare request
    url = "https://functions.poehali.dev/eb523ac0-0903-4780-8f5d-7e0546c1eda5"
    payload = {
        "action": "login",
        "email": "admin@test.com",
        "password": "admin123"
    }
    
    print(f"Request URL: {url}")
    print(f"Request Payload: {json.dumps(payload, indent=2)}\n")
    
    # Make POST request
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req) as response:
            status_code = response.status
            response_body = response.read().decode('utf-8')
            
            print(f"Response Status: {status_code}")
            print(f"Response Body: {response_body}")
            
            # Try to pretty print if it's JSON
            try:
                response_json = json.loads(response_body)
                print(f"\nFormatted Response:")
                print(json.dumps(response_json, indent=2))
            except:
                pass
                
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code}")
        error_body = e.read().decode('utf-8')
        print(f"Error Response Body: {error_body}")
        
        # Try to pretty print error if it's JSON
        try:
            error_json = json.loads(error_body)
            print(f"\nFormatted Error Response:")
            print(json.dumps(error_json, indent=2))
        except:
            pass
            
    except Exception as e:
        print(f"Error: {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    test_login()
