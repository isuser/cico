import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function BarcodeScannerScreen({
  onClose,
  onScanned,
}: {
  onClose: () => void;
  onScanned: (barcode: string) => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarcodeScanned = (result: { data: string }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    onScanned(result.data);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#141416' }}>
      {permission?.granted ? (
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      ) : null}

      <SafeAreaView
        style={{
          ...StyleSheetAbsoluteFill,
          padding: Spacing.four,
          justifyContent: 'space-between',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={onClose} hitSlop={12}>
            <ThemedText type="default" style={{ color: '#ffffff' }}>
              ✕
            </ThemedText>
          </Pressable>
          <ThemedText type="bold" style={{ color: '#ffffff' }}>
            Scan Barcode
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <View style={{ alignItems: 'center', gap: Spacing.four }}>
          <ThemedText type="default" style={{ color: '#ffffff', textAlign: 'center' }}>
            {permission?.granted
              ? 'Point your camera at a barcode'
              : 'Camera access is needed to scan barcodes'}
          </ThemedText>
          {permission?.granted ? (
            <View style={{ width: 220, height: 140 }}>
              <ScannerCorner position="topLeft" />
              <ScannerCorner position="topRight" />
              <ScannerCorner position="bottomLeft" />
              <ScannerCorner position="bottomRight" />
            </View>
          ) : (
            <Pressable
              onPress={requestPermission}
              style={{
                backgroundColor: '#FF6B6B',
                paddingVertical: Spacing.three,
                paddingHorizontal: Spacing.five,
                borderRadius: Spacing.three,
              }}>
              <ThemedText type="default" style={{ color: '#ffffff' }}>
                Grant camera access
              </ThemedText>
            </Pressable>
          )}
        </View>

        <View style={{ alignItems: 'center', gap: Spacing.three }}>
          <ThemedText type="label" style={{ color: '#B0A199' }}>
            Works with EAN, UPC, and QR codes
          </ThemedText>
          <Pressable onPress={onClose}>
            <ThemedText type="bold" style={{ color: '#ffffff' }}>
              Enter barcode manually
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const StyleSheetAbsoluteFill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

function ScannerCorner({
  position,
}: {
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}) {
  const isTop = position === 'topLeft' || position === 'topRight';
  const isLeft = position === 'topLeft' || position === 'bottomLeft';
  return (
    <View
      style={{
        position: 'absolute',
        width: 24,
        height: 24,
        [isTop ? 'top' : 'bottom']: 0,
        [isLeft ? 'left' : 'right']: 0,
        borderColor: '#ffffff',
        borderTopWidth: isTop ? 3 : 0,
        borderBottomWidth: isTop ? 0 : 3,
        borderLeftWidth: isLeft ? 3 : 0,
        borderRightWidth: isLeft ? 0 : 3,
      }}
    />
  );
}
