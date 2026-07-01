import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface SucessoPedidoModalProps {
  visivel: boolean;
  numeroPedido?: string;
  onFechar: () => void;
}

export const SucessoPedidoModal: React.FC<SucessoPedidoModalProps> = ({
  visivel,
  numeroPedido,
  onFechar,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visivel) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [visivel]);

  return (
    <Modal visible={visivel} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
          </View>

          <Text style={styles.titulo}>Pedido Confirmado!</Text>

          {numeroPedido && (
            <View style={styles.pedidoInfo}>
              <Text style={styles.pedidoLabel}>Número do Pedido</Text>
              <Text style={styles.numeroPedido}>{numeroPedido}</Text>
            </View>
          )}

          <Text style={styles.mensagem}>
            Seu pedido foi recebido com sucesso. Você receberá uma notificação quando estiver pronto!
          </Text>

          <TouchableOpacity
            style={styles.botao}
            onPress={onFechar}
            activeOpacity={0.7}
          >
            <Text style={styles.botaoTexto}>Continuar Comprando</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  iconContainer: {
    marginBottom: SPACING.lg,
  },
  titulo: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  pedidoInfo: {
    marginVertical: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    width: '100%',
  },
  pedidoLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  numeroPedido: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  mensagem: {
    fontSize: TYPOGRAPHY.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: SPACING.lg,
    lineHeight: 24,
  },
  botao: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    marginTop: SPACING.lg,
    width: '100%',
  },
  botaoTexto: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.md,
    fontWeight: '700',
    textAlign: 'center',
  },
});
