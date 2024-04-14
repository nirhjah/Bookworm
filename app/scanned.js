import {Alert, Button, Image, StyleSheet, View} from 'react-native';
import {Link, useGlobalSearchParams} from "expo-router";

export default function Scanned() {

    const params = useGlobalSearchParams();
    let title = params.title; // Directly access the title value
    let newText = params.newText; // Directly access the title value
    console.log("This is new text: " + newText)
    if (Array.isArray(title)) {
        title = title.join(', '); // Use a delimiter of your choice
    }



    async function fetchWordDefinition(word) {
        try {
            const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
            console.log("this is api url: " + apiUrl)
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("This is data: ", data)

            const meanings = data[0]?.meanings;
            console.log("This is meanings: ", meanings)

            if (meanings && meanings.length > 0) {
                const definitions = meanings[0]?.definitions;

                console.log("This is definitions", definitions[0].definition);
                return definitions[0].definition
            } else {
                console.log('No meanings found for the word');
                return "No definition found.";
            }

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    const createTwoButtonAlert = (title, definitons) =>

        Alert.alert(title, definitons, [
            {
                text: 'Cancel',
                onPress: () => console.log('pressed cancel'),
                style: 'cancel',
            },
            {text: 'Add', onPress: () => console.log('added to saved words')},
        ]);


/*    const analyzeImage = async (uri) => {
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
            } else {
                setExtractedText('No text found in the image.');
            }
        } catch (error) {
            console.error('Error analyzing image:', error);
        }
    };*/


/*
     analyzeImage(title).then(r => console.log("analyzed image"))
*/
    const lines = newText.split('\n');

    // Split each line into words
    const words = lines.flatMap((line) => line.split(' '));




    return (

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image
                source={{ uri: title }}
                style={{ width: 200, height: 200 }} // Adjust the width and height as needed
            />

            <Link href="/">home</Link>


            <View style={styles.container2}>
                {words.map((word, index) => (
                    <View key={index} style={styles.buttonContainer}>
                        <Button
                            title={word} onPress={() => fetchWordDefinition(word)
                            .then(definitions => {
                                if (definitions) {
                                    // Call your createTwoButtonAlert function here, passing the definitions as needed
                                    createTwoButtonAlert(word, definitions);
                                } else {
                                    console.log('No meanings found for the word');
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            })}
                        />
                    </View>
                ))}
            </View>

        </View>



)



    ;

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {

        marginVertical: 20,
    },
    text: {
        textAlign: 'center',
        marginHorizontal: 20,
    },
    container2: {
        backgroundColor: 'blue',
        width: 300,
        height: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        margin: 5, // Adjust the spacing between buttons as needed
    }
});
