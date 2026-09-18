import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appTheme from '../../../utils/appTheme';

/**
 * Shared look for the State / City / Customer-type pickers: the list drops
 * down attached to the field (like a native spinner), with a search box,
 * divider rows and a check mark on the selected option.
 */
export const pickerListProps = (options: {
  selectedValue?: string | null;
  searchPlaceholder?: string;
  icon?: string;
}) => ({
  mode: 'default' as const,
  // Opens below the field, or above it when there's no room underneath.
  dropdownPosition: 'auto' as const,
  maxHeight: 300,
  containerStyle: styles.sheet,
  activeColor: 'transparent',
  showsVerticalScrollIndicator: false,
  inputSearchStyle: styles.searchInput,
  placeholderStyle: styles.placeholder,
  selectedTextStyle: styles.selectedText,
  iconColor: '#6B6B6B',
  renderLeftIcon: options.icon
    ? () => <Ionicons name={options.icon!} size={18} color="#6B6B6B" style={{ marginRight: 8 }} />
    : undefined,
  renderInputSearch: (onSearch: (text: string) => void) => (
    <View style={styles.searchRow}>
      <Ionicons name="search" size={18} color="#8A8A8A" />
      <TextInput
        style={styles.searchText}
        placeholder={options.searchPlaceholder || 'Search...'}
        placeholderTextColor="#A0A0A0"
        onChangeText={onSearch}
        autoCorrect={false}
      />
    </View>
  ),
  renderItem: (item: any) => {
    const selected = item?.value != null && item.value === options.selectedValue;
    return (
      <View style={[styles.item, selected && styles.itemSelected]}>
        <Text style={[styles.itemText, selected && styles.itemTextSelected]} numberOfLines={1}>
          {item?.label}
        </Text>
        {selected ? (
          <View style={styles.check}>
            <Ionicons name="checkmark" size={14} color={appTheme.DARK_BOTTOMTAB} />
          </View>
        ) : null}
      </View>
    );
  },
});

const styles = StyleSheet.create({
  sheet: {
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingTop: 8,
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 6,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    color: 'black',
    marginLeft: 8,
    paddingVertical: 0,
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
  },
  placeholder: {
    fontSize: 15,
    color: '#A0A0A0',
  },
  selectedText: {
    fontSize: 15,
    color: 'black',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED',
  },
  itemSelected: {
    backgroundColor: '#FFF6D6',
    borderBottomColor: 'transparent',
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1C',
  },
  itemTextSelected: {
    fontWeight: '700',
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
