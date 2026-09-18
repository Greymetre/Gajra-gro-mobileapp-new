import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DocumentTile, KycCardHeader, kycStyles } from './KycCardParts';

interface Props {
  imageUri?: string | null;
  error?: string | null;
  onPick: () => void;
  onRemove: () => void;
  onPreview: () => void;
}

const ShopImageCard = (props: Props) => (
  <View style={kycStyles.card}>
    <KycCardHeader icon="storefront-outline" title="Shop Image" required />
    <DocumentTile
      uri={props.imageUri}
      locked={false}
      emptyText="Tap to upload a photo of your shop"
      error={props.error}
      onPick={props.onPick}
      onRemove={props.onRemove}
      onPreview={props.onPreview}
    />
    <Text style={styles.hint}>Take a clear photo of the shop front with the name board visible.</Text>
  </View>
);

export default ShopImageCard;

const styles = StyleSheet.create({
  hint: {
    fontSize: 11,
    color: '#8A8A8A',
    marginTop: 6,
  },
});
