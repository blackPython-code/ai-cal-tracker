import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const { signOut } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();


  return (
    <LinearGradient
      colors={['#ffffff', '#f0f4f8']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View>

          <Text style={styles.greeting}>Hello,</Text>
          {!isUserLoaded ? (
            <Text style={styles.username}>Loading...</Text>
          ) : (
            <Text style={styles.username}>{user?.fullName || user?.firstName || 'User'}</Text>
          )
          }
        </View>
        <TouchableOpacity onPress={() => signOut()} style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Calories Today</Text>
          <Text style={styles.caloriesText}>0 / 2000</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '0%' }]} />
          </View>
        </View>



        <View style={styles.actions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.iconContainer, { backgroundColor: '#e0e7ff' }]}>
                <Ionicons name="camera" size={24} color="#4f46e5" />
              </View>
              <Text style={styles.actionText}>Scan Meal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.iconContainer, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="add-circle" size={24} color="#16a34a" />
              </View>
              <Text style={styles.actionText}>Add Manual</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  signOutButton: {
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  caloriesText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 6,
  },
  actions: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  recordedContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 32,
    height: 50,



  },
});
