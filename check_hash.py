import hashlib

password = "admin123"
hash_result = hashlib.sha256(password.encode()).hexdigest()
print(hash_result)

expected = "ed0cb90bdfa4f93981a7d03cff99213a30193eea67ed7a65f6f30e61a0781d2d"
print(f"\nComputed: {hash_result}")
print(f"Expected: {expected}")
print(f"\nMatch: {hash_result == expected}")
