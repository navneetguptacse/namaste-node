# DevTinder APIs

## Authentication APIs
- **POST** `/auth/register`
- **POST** `/auth/login`
- **POST** `/auth/logout`

---

## Profile APIs
- **GET** `/profile/me`
- **PATCH** `/profile/me`
- **PATCH** `/profile/me/password`

---

## Connection Request APIs
- **POST** `/connections/send/:id` status: like | pass
- **POST** `/connections/review/:id` status: accept | reject

---

## User APIs
- **GET** `/users/connections`
- **GET** `/users/requests`
- **GET** `/users/feed`
