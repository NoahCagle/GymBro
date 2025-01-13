import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles';

function CardioListItem(props) {
    const session = props.session;
    const headerPrefix = props.headerPrefix;

    return (
        <View style={globalStyles.formWrapper}>
            <Text style={[globalStyles.formTitle, { textDecorationLine: 'underline' }]}>{headerPrefix + session.typeName}</Text>
            <Text style={globalStyles.formText}>- Went for {session.time} minutes</Text>
            <Text style={globalStyles.formText}>- Burned {session.caloriesBurned} calories</Text>
        </View>
    )
}

export default CardioListItem;