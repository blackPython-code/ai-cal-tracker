import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { userService } from '../../services/userService';

export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSignInPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (completeSignIn.status === 'complete') {
                await setActive({ session: completeSignIn.createdSessionId });

                // Save/Check user in Firebase
                const userId = (completeSignIn as any).createdUserId;
                if (userId) {
                    await userService.saveUser(
                        userId,
                        emailAddress,
                        'User'
                    );
                }

                router.replace('/');
            } else {
                console.error(JSON.stringify(completeSignIn, null, 2));
            }
        } catch (err: any) {
            Alert.alert('Error', err.errors[0].message);
        } finally {
            setLoading(false);
        }
    };

    const onGoogleSignInPress = async () => {
        // TODO: Implement Google OAuth flow
        Alert.alert("Coming Soon", "Google Sign In implementation requires OAuth configuration.");
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
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to track your calories</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                            <TextInput
                                autoCapitalize="none"
                                value={emailAddress}
                                placeholder="Email Address"
                                placeholderTextColor="#94a3b8"
                                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
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
                            style={styles.signInButton}
                            onPress={onSignInPress}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#4f46e5', '#3730a3']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.signInButtonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignInPress}>
                            <Ionicons name="logo-google" size={20} color="#000" style={{ marginRight: 10 }} />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <Link href="/sign-up" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.linkText}>Sign Up</Text>
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
    signInButton: {
        marginTop: 8,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#94a3b8',
        fontSize: 14,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingVertical: 16,
        marginBottom: 24,
    },
    googleButtonText: {
        color: '#1e293b',
        fontSize: 16,
        fontWeight: '600',
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
