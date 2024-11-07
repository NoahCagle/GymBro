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
        fontStyle: 'italic'
    },
    formTitle: {
        color: globalStyleVariables.textColor,
        fontSize: 24,
        textAlign: 'center',
        alignSelf: 'center',
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
    inputText: {
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
    formButtonRowWrapper: {
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