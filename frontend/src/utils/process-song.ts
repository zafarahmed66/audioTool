import axios from "axios";

export const processSong = async (file: File) => {
    try {
        const response = await axios.post(
            `http://localhost:3000/api/v1/enhance`,
            {
          file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
