import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/styles';

function AgendaItem(props) {
    const item = props.item;
    return (
        <TouchableOpacity>
            <View style={globalStyles.rowSpacingWrapper}>
                <View>
                    <Text style={[globalStyles.formTitle, { textDecorationLine: 'underline', color: "#000" }]}>Sets</Text>
                </View>
                <View>
                    <Text style={[globalStyles.formTitle, { textDecorationLine: 'underline', color: "#000" }]}>Weigh-Ins</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default AgendaItem;