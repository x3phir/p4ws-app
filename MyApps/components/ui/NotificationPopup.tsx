import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Bell, X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

interface NotificationPopupProps {
    notification: {
        id: string;
        title: string;
        message: string;
    } | null;
    onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose }) => {
    const [visible, setVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(200)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const soundRef = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        if (notification) {
            showPopup();
            playSound();
        }
    }, [notification]);

    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3' }
            );
            soundRef.current = sound;
            await sound.playAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    };

    const showPopup = () => {
        setVisible(true);
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto close after 5 seconds
        setTimeout(() => {
            hidePopup();
        }, 5000);
    };

    const hidePopup = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setVisible(false);
            onClose();
        });
    };

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    if (!visible || !notification) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateX: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <TouchableOpacity
                style={styles.content}
                onPress={() => {
                    hidePopup();
                    router.push('/notifications' as any);
                }}
            >
                <View style={styles.iconContainer}>
                    <Bell size={20} color="white" fill="white" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>
                        {notification.title}
                    </Text>
                    <Text style={styles.message} numberOfLines={2}>
                        {notification.message}
                    </Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={hidePopup}>
                    <X size={16} color="#9CA3AF" />
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        width: width * 0.85,
        maxWidth: 320,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 12,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        zIndex: 9999,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    message: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
    },
    closeBtn: {
        padding: 4,
    },
});

export default NotificationPopup;
