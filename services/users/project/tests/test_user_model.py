import unittest 

from sqlalchemy.exc import IntegrityError
from project import db
from project.api.models import User
from project.tests.base import BaseTestCase

class TestUserModel(BaseTestCase):

    def test_add_user(self):
        user = User(
            email = 'test@test.com',
        )
        db.session.add(user)
        db.session.commit()
        self.assertTrue(user.id)
        self.assertEqual(user.email,'test@test.com')
    
    def test_add_user_duplicate_email(self):
        user = User(
            email = 'test@test.com',
        )
        db.session.add(user)
        db.session.commit()
        duplicate_user = User(
            email = 'test@test.com',
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError,db.session.commit)

    def test_to_json(self):
        user = User(
            email = 'test@test.com',
        )
        db.session.add(user)
        db.session.commit()
        self.assertTrue(isinstance(user.to_json(),dict))

if __name__ == '__main__':
    unittest.main()