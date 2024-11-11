import axios from 'axios';

const testApiUrl = process.env.TEST_API_URL;

describe('When making a client-to-server M2M call', () => {
  const axiosOptions = {
    baseURL: testApiUrl,
    validateStatus: () => true,
  };

  describe('using an allowed endpoint', () => {
    it('should succeed', async () => {
      // ARRANGE
      const path = '/allowed';

      // ACT
      const { status } = await axios.get(path, axiosOptions);

      // ASSERT
      expect(status).toEqual(200);
    });
  });

  describe('using a disallowed endpoint', () => {
    it('should fail with 403', async () => {
      // ARRANGE
      const path = '/disallowed';

      // ACT
      const { status } = await axios.get(path, axiosOptions);

      // ASSERT
      expect(status).toEqual(403);
    });
  });
});
