const BASE_URL = import.meta.env.VITE_API_URL;

const Api = {
    SIGN_IN: `${BASE_URL}/users/login`,
    SIGN_UP: `${BASE_URL}/users/register`,
    SUBMIT_QUIZ: `${BASE_URL}/quiz/submit`,
    FORGOT_PASSWORD: `${BASE_URL}/users/forgot-password`,
    VERIFY_OTP: `${BASE_URL}/users/verify-otp`,
    SERVER_URL: BASE_URL,
    COMMUNITY_URL: `${BASE_URL}/communities/view`,
    CHECK_EMAIL: `${BASE_URL}/users/email`,
    CHECK_USERNAME: `${BASE_URL}/users/username`,
    COMMUNITY_GET_URL: `${BASE_URL}/communities/viewAll`,
    CREATE_GROUP: `${BASE_URL}/groups/create`,
    ADMIN_LOGIN: `${BASE_URL}/admin/login`,
    GET_POST_EXCEPT_USER: `${BASE_URL}/posts/all-posts`,
    GET_COMMUNITY_POST: `${BASE_URL}/posts/getCommunityPosts`,
    GET_USER_POST: `${BASE_URL}/posts/getUserPosts`,
    GET_DAILY_CHALLENGE: `${BASE_URL}/challenge/daily-challenge`,
    SEND_NOTIFICATION: `${BASE_URL}/notifications`,
    BASIC_POST_ROUTE: `${BASE_URL}/posts`,
    ADD_COMMENT: `${BASE_URL}/comments/addComment`,
    GET_COMMUNITY_USERS: `${BASE_URL}/users/get-community-users`,
};

export default Api;
