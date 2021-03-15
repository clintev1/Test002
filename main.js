// High-accuracy landmark detection and face classification
FaceDetectorOptions highAccuracyOpts =
        new FaceDetectorOptions.Builder()
                .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
                .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_ALL)
                .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL)
                .build();

// Real-time contour detection
FaceDetectorOptions realTimeOpts =
        new FaceDetectorOptions.Builder()
                .setContourMode(FaceDetectorOptions.CONTOUR_MODE_ALL)
                .build();
                
private class YourAnalyzer implements ImageAnalysis.Analyzer {

    @Override
    public void analyze(ImageProxy imageProxy) {
        Image mediaImage = imageProxy.getImage();
        if (mediaImage != null) {
          InputImage image =
                InputImage.fromMediaImage(mediaImage, imageProxy.getImageInfo().getRotationDegrees());
          // Pass image to an ML Kit Vision API
          // ...
        }
    }
}

private static final SparseIntArray ORIENTATIONS = new SparseIntArray();
static {
    ORIENTATIONS.append(Surface.ROTATION_0, 0);
    ORIENTATIONS.append(Surface.ROTATION_90, 90);
    ORIENTATIONS.append(Surface.ROTATION_180, 180);
    ORIENTATIONS.append(Surface.ROTATION_270, 270);
}

/**
 * Get the angle by which an image must be rotated given the device's current
 * orientation.
 */
@RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
private int getRotationCompensation(String cameraId, Activity activity, boolean isFrontFacing)
        throws CameraAccessException {
    // Get the device's current rotation relative to its "native" orientation.
    // Then, from the ORIENTATIONS table, look up the angle the image must be
    // rotated to compensate for the device's rotation.
    int deviceRotation = activity.getWindowManager().getDefaultDisplay().getRotation();
    int rotationCompensation = ORIENTATIONS.get(deviceRotation);

    // Get the device's sensor orientation.
    CameraManager cameraManager = (CameraManager) activity.getSystemService(CAMERA_SERVICE);
    int sensorOrientation = cameraManager
            .getCameraCharacteristics(cameraId)
            .get(CameraCharacteristics.SENSOR_ORIENTATION);

    if (isFrontFacing) {
        rotationCompensation = (sensorOrientation + rotationCompensation) % 360;
    } else { // back-facing
        rotationCompensation = (sensorOrientation - rotationCompensation + 360) % 360;
    }
    return rotationCompensation;
}

InputImage image = InputImage.fromMediaImage(mediaImage, rotation);

InputImage image;
try {
    image = InputImage.fromFilePath(context, uri);
} catch (IOException e) {
    e.printStackTrace();
}

InputImage image = InputImage.fromByteBuffer(byteBuffer,
        /* image width */ 480,
        /* image height */ 360,
        rotationDegrees,
        InputImage.IMAGE_FORMAT_NV21 // or IMAGE_FORMAT_YV12
);

// Or:
InputImage image = InputImage.fromByteArray(
        byteArray,
        /* image width */480,
        /* image height */360,
        rotation,
        InputImage.IMAGE_FORMAT_NV21 // or IMAGE_FORMAT_YV12
);

InputImage image = InputImage.fromBitmap(bitmap, rotationDegree);

FaceDetector detector = FaceDetection.getClient(options);
// Or use the default options:
// FaceDetector detector = FaceDetection.getClient();

Task<List<Face>> result =
        detector.process(image)
                .addOnSuccessListener(
                        new OnSuccessListener<List<Face>>() {
                            @Override
                            public void onSuccess(List<Face> faces) {
                                // Task completed successfully
                                // ...
                            }
                        })
                .addOnFailureListener(
                        new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                // Task failed with an exception
                                // ...
                            }
                        });
