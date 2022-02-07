import ajax from '../ajax';

const BASE_URL = '/api';

const commonApi = {
	reqSignin: () =>
		ajax(
			`${BASE_URL}/user/signin`,
			{
				/* userid, passOrigin */
			},
			'POST'
		),
};

export default commonApi;
