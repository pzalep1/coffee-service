export const mockedJwtService = {
    sign: () => ''
}

export const fakeUser = {
    "email": "carcher@enterprise.gov",
    "name": "Captain Archer",
    "organization": "University of Awesome Sauce",
    "password": "IlikegreeneggsAndHam$$Money",
    "roles": []
}

export const fakeUser2 = {
    "email": "pzalep1@students.towson.edu",
    "name": "Paige Zaleppa",
    "organization": "University of Awesome Sauce",
    "password": "wowIcanreallydancetotheyear3000",
    "roles": []
}

export const fakeAdmin = {
    "email": "swagCurriculum@swaglearning.team",
    "name": "Cardi B",
    "organization": "Swag Curriculum",
    "password": "realestAdmin$999",
    "roles": ["admin"]
}

export const missingEmail = {
    "name": "Cardi B",
    "organization": "Swag Curriculum",
    "password": "realestAdmin#44"
}

export const missingName = {
    "email": "swagCurriculum@swaglearning.team",
    "organization": "Swag Curriculum",
    "password": "realestAdmin#22"
}

export const missingOrg = {
    "email": "swagCurriculum@swaglearning.team",
    "name": "Cardi B",
    "password": "realestAdmin#22"
}

export const validUser = {
    "email": "swagCurriculum@swaglearning.com",
    "name": "Cardi Bacardi",
    "organization": "Swag Curriculum",
    "password": "realestAdmin$999",
}