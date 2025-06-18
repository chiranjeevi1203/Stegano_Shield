# **App Name**: SteganoShield

## Core Features:

- Image Loading: Loads and processes images from a local directory to prepare them for analysis.
- Entropy Calculation: Calculates the Shannon entropy of image data to detect anomalies indicative of hidden content.
- File Type and Metadata Detection: Detects file type to ensure the image format is valid. Also reads image metadata using Python's filetype library.
- Malware Classification: Applies a pre-trained machine learning model to classify images as either benign or potentially containing steganographically hidden content.
- Results Dashboard: Presents a dashboard displaying image analysis results, including file details and classification outcomes.

## Style Guidelines:

- Primary color: Sunny Yellow (#FFC107) evokes a summer feel and a sense of vigilance, contrasting sharply against darker backgrounds.
- Background color: Light Sand (#F5F5DC), providing a gentle, desaturated base to highlight the analytic results.
- Accent color: Sky Blue (#87CEEB) to complement the yellow and adds a calming but noticeable contrast for calls to action.
- Body and headline font: 'Poppins' sans-serif for a clean, modern look. Note: currently only Google Fonts are supported.
- Header aligns to the left top for ease of navigation, focusing on immediate access to core functions without a central logo.