import {useEffect, useState} from 'react';
import {Button, Image, View, StyleSheet, Text, TouchableOpacity, ImageBackground, Pressable} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {GOOGLE_CLOUD_VISION_API_KEY} from "./secret";
import {Camera} from 'expo-camera';
import { Link } from 'expo-router';


export default function Home() {


    const [image, setImage] = useState(null);
    const [extractedTextNew, setExtractedTextNew] = useState("hello");
    const [extractedText, setExtractedText] = useState(null);

    let camera = Camera
    const [startCamera,setStartCamera] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const __startCamera = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync()
        if (status === 'granted') {
            // start the camera
            setStartCamera(true)
        } else {
            Alert.alert('Access denied')
        }
    }

    const __endCamera = async () => {
        setStartCamera(false);
    }

    const __deletePicture = async () => {
        setCapturedImage(null);
    }

    useEffect(() => {
        console.log('capturedImage updated:', capturedImage);
    }, [capturedImage]); // Run this effect whenever capturedImage changes


    const __takePicture = async () => {
        if (!camera) return
        const photo = await camera.takePictureAsync()
        console.log(photo)
/*
        setPreviewVisible(true)
*/
        setCapturedImage(photo.uri)

        console.log('sdsfds BEFORE scanned page, photo', photo)

        console.log('sdsfds BEFORE scanned page', capturedImage)
        await analyzeImage(photo.uri);


        /*  setStartCamera(false);*/
    }


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
/*
            setImage(result.assets[0].uri);
*/
            setCapturedImage(result.assets[0].uri)

            await analyzeImage(result.assets[0].uri);

        }
    };

    const analyzeImage = async (uri) => {
        try {
            let base64ImageData = await fetch(uri);
            base64ImageData = await base64ImageData.blob();
            base64ImageData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = reject;
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(base64ImageData);
            });

            const body = JSON.stringify({
                requests: [
                    {
                        image: {
                            content: base64ImageData.replace('data:image/jpeg;base64,', ''),
                        },
                        features: [
                            {
                                type: 'TEXT_DETECTION',
                            },
                        ],
                    },
                ],
            });

            let response = await fetch(
                `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body,
                }
            );

            let json = await response.json();
            console.log(json);

            if (
                json &&
                json.responses &&
                json.responses.length > 0 &&
                json.responses[0].textAnnotations
            ) {
                setExtractedText(json.responses[0].textAnnotations[0].description);
                setExtractedTextNew(json.responses[0].textAnnotations[0].description);
            } else {
                setExtractedText('No text found in the image.');
                setExtractedTextNew('No text found in the image.');

            }
        } catch (error) {
            console.error('Error analyzing image:', error);
        }
    };

    const CameraPreview = ({photo}) => {
        console.log('sdsfds', photo)
        return (
            <View
                style={{
                    backgroundColor: 'transparent',
                    flex: 1,
                    width: '100%',
                    height: '100%'
                }}
            >
                <ImageBackground
                    source={{uri: photo && photo.uri}}
                    style={{
                        flex: 1
                    }}
                />
            </View>
        )
    }


    return (
        <View style={styles.container}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            {extractedText && <Text style={styles.text}>{extractedText}</Text>}


            {/*Camera tutorial used: https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/*/}

           {/* { capturedImage ? (




                <View
                >
                    <Button title={"Close"} onPress={__deletePicture} />
                    <CameraPreview photo={capturedImage} />
                </View>




            ) :  null }*/}


            <Link  href={{
                pathname: "/scanned",
                params: { title: capturedImage,
                          newText: extractedTextNew  },
            }} >GO TO SCANNED</Link>



            {startCamera ? (
                <Camera
                    style={{flex: 1,width:"100%"}}
                    ref={(r) => {
                        camera = r
                    }}
                >

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            flexDirection: 'row',
                            flex: 1,
                            width: '100%',
                            padding: 20,
                            justifyContent: 'space-between'
                        }}
                    >
                        <View
                            style={{
                                alignSelf: 'center',
                                flex: 1,
                                alignItems: 'center'
                            }}
                        >


                           {/* <TouchableOpacity
                                onPress={__takePicture}
                                style={{
                                    width: 70,
                                    height: 70,
                                    bottom: 0,
                                    borderRadius: 50,
                                    backgroundColor: '#fff',
                                }}
                            />*/}

                           <>
                                {capturedImage ? (
                                    <Link
                                        href={{
                                            pathname: '/scanned',
                                            params: { title: capturedImage,
                                                newText: extractedTextNew   },
                                        }}
                                        asChild
                                    >
                                        <TouchableOpacity
                                            style={{
                                                width: 70,
                                                height: 70,
                                                bottom: 0,
                                                borderRadius: 50,
                                                backgroundColor: '#fff',
                                            }}
                                        />
                                    </Link>
                                ) : (
                                    <TouchableOpacity
                                        onPress={__takePicture}
                                        style={{
                                            width: 70,
                                            height: 70,
                                            bottom: 0,
                                            borderRadius: 50,
                                            backgroundColor: '#fff',
                                        }}
                                    />
                                )}
                            </>





                            {/*<Link  href={{
                                pathname: "/scanned",
                                params: { title: capturedImage },
                            }} asChild>
                            <TouchableOpacity

                                onPress={__takePicture}

                                style={{
                                    width: 70,
                                    height: 70,
                                    bottom: 0,
                                    borderRadius: 50,
                                    backgroundColor: '#fff'
                                }}/>
                            </Link>*/}
                        </View>
                    </View>


                    <Button title={"Close"} onPress={__endCamera} />

                </Camera>
            ) : (


                <Button title="Take image with camera" onPress={__startCamera} />



            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 20,
    },
    text: {
        textAlign: 'center',
        marginHorizontal: 20,
    },
});
