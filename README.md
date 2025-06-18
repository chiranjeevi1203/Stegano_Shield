Malicious Image Detector
This project is a simple but powerful tool that detects if an image contains malicious code using computer vision and metadata forensics. The model is trained using the "Malware as Images" dataset from Kaggle, where malware binary files are converted into grayscale images. We also use benign images (normal pictures) to help the model learn to tell the difference between safe and suspicious images.

The core idea is to extract features from each image—like its file size, dimensions, pixel randomness (entropy), file type (MIME), and metadata tags—and use those features to train a machine learning model. I used a Random Forest Classifier from scikit-learn, which gives good accuracy and is easy to interpret.

Once trained, the model can predict whether any image is malicious or benign(Safe). You can test it by placing sample images in a folder, and the system will analyze and report if it’s safe or dangerous(Malicious). A small web app is also built using Firebase and TypeScript, so you can upload an image through a simple interface and instantly get a result.

The backend is written in Python and uses libraries like Pillow, OpenCV, filetype, and exifread to handle image processing and metadata extraction. The frontend is hosted on Firebase and written in TypeScript, allowing you to interact with the model through a browser.

This is a great beginner-friendly computer vision project that combines machine learning, image analysis, and web deployment—all in one. It's especially useful for understanding how non-obvious threats (like malicious images) can be detected using clever forensic techniques.
