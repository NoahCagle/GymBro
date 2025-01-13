import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

function WeightTracker(props) {
    const [weights, setWeights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [docExists, setDocExists] = useState(false);
    const navigation = props.navigation;
    const docRef = doc(db, "dataTracker", auth.currentUser.uid);

    // I don't know exactly how this hook works, but it's the only way I've been able to make sure the data displayed on-screen is up to date
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const dates = snapshot.data().dates;
                        setWeights(combineLogs(dates).reverse());
                        setDocExists(true);
                        setLoading(false);
                    } else {
                        setDocExists(false);
                        setLoading(false);
                    }
                } catch (error) {
                    alert(error.message);
                }
            }
            loadData();
        }, [])
    )

    const combineLogs = (dates) => {
        let ret = [];

        for (let i = 0; i < dates.length; i++) {
            ret = [...ret, ...dates[i].bodyWeightLogs];
        }

        return ret;
    }

    const returnBody = () => {
        return (
            <View>
                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("AddWeight")}>
                    <Text style={[globalStyles.buttonTitle, { textAlign: 'center' }]}>Conduct Weigh-In</Text>
                </TouchableOpacity>
                <View style={globalStyles.formWrapper}>
                    <Text style={globalStyles.formTitle}>Complete History</Text>
                    {
                        loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                            docExists && weights.length > 0 ?
                                weights.map((weight, index) => {
                                    return (<Text key={index} style={globalStyles.formText}>{weight.date + ": " + weight.weight} lbs</Text>)
                                })
                                :
                                (<Text style={globalStyles.formText}>No weigh-ins tracked yet!</Text>)

                    }
                </View>
            </View>
        )
    }

    const returnChart = () => {
        if (!loading && docExists && weights.length > 0) {
            const datapointsToChart = 5;

            const removeYear = (date) => {
                return date.substring(0, date.length - 5);
            }

            const lastXDates = (x) => {
                if (weights.length >= x) {
                    let ret = [];
                    for (let i = 0; i < x; i++) {
                        ret.push(removeYear(weights[i].date));
                    }
                    return ret;
                }
                let ret = [];
                for (let i = 0; i < weights.length; i++) {
                    ret.push(removeYear(weights[i].date));
                }
                return ret;
            }

            const lastXWeights = (x) => {
                if (weights.length >= x) {
                    let ret = [];
                    for (let i = 0; i < x; i++) {
                        ret.push(weights[i].weight);
                    }
                    return ret;
                }
                let ret = [];
                for (let i = 0; i < weights.length; i++) {
                    ret.push(weights[i].weight);
                }
                return ret;
            }

            const data = {
                labels: lastXDates(datapointsToChart).reverse(),
                datasets: [
                    {
                        data: lastXWeights(datapointsToChart).reverse()
                    }
                ]
            }

            if (weights.length >= datapointsToChart)
                return (
                    <LineChart
                        data={data}
                        width={Dimensions.get("window").width * 0.9}
                        height={300}
                        yAxisSuffix=" lbs"
                        chartConfig={{
                            backgroundGradientFrom: globalStyleVariables.formBgColor,
                            backgroundGradientTo: globalStyleVariables.bgColor,
                            color: (opacity = 1) => `rgba(255, 127, 80, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            decimalPlaces: 0,
                            style: {
                                borderRadius: 1
                            },
                            propsForDots: {
                                r: "3",
                                strokeWidth: "2",
                                stroke: "#ffffff"
                            }
                        }}
                        style={{
                            marginTop: 20,
                            alignSelf: 'center',
                            padding: 0,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: globalStyleVariables.outlineColor
                        }}
                    />
                )
            else
                return (<Text style={globalStyles.screenSubtitle}>Not enough logs to chart yet!</Text>)
        }
    }

    return (
        <ScrollView>
            {returnChart()}
            {returnBody()}
        </ScrollView>
    )

}

export default WeightTracker;