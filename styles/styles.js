import { Platform, StyleSheet } from "react-native";

export const globalStyleVariables = {
    textColor: '#fff',
    bgColor: '#111122',
    formBgColor: '#111133',
    fabColor: '#223333',
    buttonColor: '#223333',
    outlineColor: '#334444',
}

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyleVariables.bgColor,
        padding: 20
    },
    screenTitle: {
        color: globalStyleVariables.textColor,
        fontSize: 24,
        fontWeight: 'bold'
    },
    screenSubtitle: {
        color: globalStyleVariables.textColor,
        fontSize: 16,
        fontStyle: 'italic',
        alignSelf: 'center',
    },
    formTitle: {
        color: globalStyleVariables.textColor,
        fontSize: 24,
        textAlign: 'center',
        alignSelf: 'center',
    },
    formSubtitle: {
        color: globalStyleVariables.textColor,
        fontSize: 20,
        textAlign: 'center',
        alignSelf: 'center',
        fontStyle: 'italic'
    },
    formText: {
        color: globalStyleVariables.textColor,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    formWrapper: {
        backgroundColor: globalStyleVariables.formBgColor,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: globalStyleVariables.outlineColor,
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 3,
        width: '100%', // Doesn't end up going to 100% width background container padding is 20
        alignSelf: 'center',
        padding: 10,
        margin: 5
    },
    collapsibleWrapper: {
        backgroundColor: globalStyleVariables.bgColor,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: globalStyleVariables.outlineColor,
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 3,
        width: '100%', // Doesn't end up going to 100% width background container padding is 20
        alignSelf: 'center',
        padding: 10,
        margin: 5
    },
    textInput: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: globalStyleVariables.outlineColor,
        backgroundColor: globalStyleVariables.bgColor,
        color: globalStyleVariables.textColor,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginVertical: 5,
        width: '100%',
    },
    textInputTitle: {
        alignSelf: 'center',
        color: globalStyleVariables.textColor,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    rowSpacingWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        backgroundColor: globalStyleVariables.buttonColor,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: globalStyleVariables.outlineColor,
        marginVertical: 5
    },
    buttonTitle: {
        color: globalStyleVariables.textColor,
        padding: 5
    },
    // Picker takes extra style from surrounding <View style={globalStyles.textInput}>
    picker: {
        pickerComponent: {
            color: globalStyleVariables.textColor,
            margin: -10,
        },
        pickerItem: {
            fontSize: 14
        }
    },
    drawerStyles: {
        mainScreenOptions: {
            headerStyle: {
                backgroundColor: globalStyleVariables.formBgColor,
            },
            headerTitleStyle: {
                color: globalStyleVariables.textColor,
            },
            headerShown: Platform.OS == 'web' ? false : true,
        },
        mainDrawerStyle: {
            drawerStyle: {
                backgroundColor: globalStyleVariables.formBgColor
            },
            drawerType: Platform.OS == 'web' ? 'permanent' : 'front',
            drawerItemStyle: {
                borderRadius: 25,
            },
            drawerLabelStyle: {
                textAlign: 'center',
                color: globalStyleVariables.textColor,
            },
            headerTintColor: globalStyleVariables.textColor,
            headerTitleAlign: 'center'
        }
    }
})