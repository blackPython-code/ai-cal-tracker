import { useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { userService } from '../../services/userService';

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const onSignUpPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            // Split name into first and last name
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');

            await signUp.create({
                emailAddress,
                password,
                firstName,
                lastName: lastName || undefined,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            Alert.alert('Error', err.errors[0].message);
        } finally {
            setLoading(false);
        }
    };

    const onPressVerify = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });

                // Save user to Firebase
                if (completeSignUp.createdUserId) {
                    await userService.saveUser(completeSignUp.createdUserId, emailAddress, name);
                }

                router.replace('/');
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
            }
        } catch (err: any) {
            console.error('Sign up error:', JSON.stringify(err, null, 2));
            Alert.alert('Error', err.errors ? err.errors[0].message : err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#ffffff', '#f0f4f8']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Image
                            source={require('../../assets/images/icon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Start your healthy journey today</Text>
                    </View>

                    <View style={styles.form}>
                        {!pendingVerification ? (
                            <>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
                                    <TextInput
                                        value={name}
                                        placeholder="Full Name"
                                        placeholderTextColor="#94a3b8"
                                        onChangeText={(name) => setName(name)}
                                        style={styles.input}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                                    <TextInput
                                        autoCapitalize="none"
                                        value={emailAddress}
                                        placeholder="Email Address"
                                        placeholderTextColor="#94a3b8"
                                        onChangeText={(email) => setEmailAddress(email)}
                                        style={styles.input}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                                    <TextInput
                                        value={password}
                                        placeholder="Password"
                                        placeholderTextColor="#94a3b8"
                                        secureTextEntry={true}
                                        onChangeText={(password) => setPassword(password)}
                                        style={styles.input}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.signUpButton}
                                    onPress={onSignUpPress}
                                    disabled={loading}
                                >
                                    <LinearGradient
                                        colors={['#4f46e5', '#3730a3']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.gradientButton}
                                    >
                                        <Text style={styles.signUpButtonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.verifyText}>We sent a verification code to {emailAddress}</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="key-outline" size={20} color="#64748b" style={styles.inputIcon} />
                                    <TextInput
                                        value={code}
                                        placeholder="Verification Code"
                                        placeholderTextColor="#94a3b8"
                                        onChangeText={(code) => setCode(code)}
                                        style={styles.input}
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.signUpButton}
                                    onPress={onPressVerify}
                                    disabled={loading}
                                >
                                    <LinearGradient
                                        colors={['#4f46e5', '#3730a3']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.gradientButton}
                                    >
                                        <Text style={styles.signUpButtonText}>{loading ? 'Verify & Create' : 'Verify Email'}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        )}

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <Link href="/sign-in" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.linkText}>Sign In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 16,
        borderRadius: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
    },
    signUpButton: {
        marginTop: 8,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 24,
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signUpButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    verifyText: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#64748b',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#64748b',
        fontSize: 14,
        marginRight: 4,
    },
    linkText: {
        color: '#4f46e5',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
