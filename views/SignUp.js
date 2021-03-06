import React from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { AuthContext } from '../context';
import axios from 'axios'

const appSettings = require('../app-settings.json');

export default function LogIn() {

    const [ firstName, setFirstName ] = React.useState("");
    const [ lastName, setLastName ] = React.useState("");
    const [ email, setEmail ] = React.useState("");
    const [ password, setPassword ] = React.useState("");
    const [ password2, setPassword2 ] = React.useState("");
    const [ disableButton, setDisableButton ] = React.useState(false);

    const { logIn } = React.useContext(AuthContext);

    const handleSignUp = () => {

        if (firstName.length == 0 || lastName.length == 0 || email.length == 0|| password.length == 0 || password2.length == 0) {
            alert("No has completado todos los campos")
            return;
        }
        if (password != password2) {
            alert("Las contraseñas no coinciden")
            return;
        }
        if (password.length < 6) {
            alert("La contraseña es demasiado corta (debe contener por lo menos 6 caracteres)")
            return;
        }
        setDisableButton(true)
        const params = {
            "email": email,
            "password": password,
            "returnSecureToken": true
        }
        axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDesU1w8wTTq4ErpwucFt4xrAOHzZH0djI", params)
            .then(function (response) {
                let token = response.data['localId']
                
                axios.post(`${appSettings['backend-host']}/customers`, {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    externalId: token
                })
                    .then(response => {
                        let postgresId =  response["data"]["id"]
                        let username = response["data"]["firstName"] + " "+ response["data"]["lastName"] 
                        logIn(token,postgresId,username)
                    })
                    .catch(error => {
                        setDisableButton(false)
                        alert(`There was an error creating the user. Error details: ${error}`)})
                
            })
            .catch(function (error) {
                setDisableButton(false)
                if (error.response.data) {
                    let code = error.response.data.error.errors[0].message
                    if (code == "EMAIL_EXISTS") {
                        alert("Ya existe una cuenta asociada a ese correo")
                    } else if (code == "TOO_MANY_ATTEMPTS_TRY_LATER") {
                        alert("Se superó el número de intentos permitidos. Prueba más tarde")
                    } else if (code == "INVALID_EMAIL") {
                        alert("El formato de correo es inválido")
                    } else {
                        alert("Error, intenta de nuevo")
                    }
                } else {
                    alert("Error, intente de nuevo")
                }
            })
    }

    return (

        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setFirstName}
                value={firstName}
                placeholder="Nombre"
                autoCapitalize='words'
            />
            <TextInput
                style={styles.input}
                onChangeText={setLastName}
                value={lastName}
                placeholder="Apellidos"
                autoCapitalize='words'
            />
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Contraseña"
                secureTextEntry={true}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword2}
                value={password2}
                placeholder="Confirma contraseña"
                secureTextEntry={true}
                autoCapitalize='none'
            />
            <View style={styles.buttonCreate}>
                <Button
                    onPress={() => handleSignUp()}
                    title="Crear"
                    color="#fc6c27"
                    accessibilityLabel="Crear"
                    disabled={disableButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    title: {
        marginBottom: "20%",
        fontFamily: "Menlo",
        fontSize: 200
    },
    stretch: {
        marginTop: '10%',
        marginBottom: '10%',
        width: 200,
        height: 200,
        resizeMode: 'contain'
    },
    buttonCreate: {
        width: "60%",
        marginTop: 20
    },
    input: {
        width: "100%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "#fff"
    },
});
