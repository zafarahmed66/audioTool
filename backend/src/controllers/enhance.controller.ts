import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import axios from 'axios';

import { PYTHON_SERVICE_URL } from "../config/env";

export const enhance = async (req: Request, res: Response) => {
    if(!req.file) {
        res.status(400).json({ success: false, error: "No file uploaded" });
        return;
    }

    try {
        const uploadsDir = path.join(__dirname, '../uploads');
    
        // Check if the uploads directory exists, create it if it doesn't
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir);
        }
    
        const filePath = path.join(uploadsDir, req.file.originalname);
    
        // Save the uploaded file temporarily
        fs.writeFileSync(filePath, req.file.buffer);

    
    
        const response = await axios.post(`${PYTHON_SERVICE_URL}/process`, {
            songUrl: filePath,
        });

        fs.unlinkSync(filePath);



    
        res.json({
            success: true,
            message: "File uploaded successfully",
            data: response.data,
        });
    
      } catch (error) {
        console.error('Error processing the audio:', error);
        res.status(500).json({ error: 'Failed to process audio' });
      }

};