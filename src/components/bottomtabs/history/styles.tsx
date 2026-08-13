import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.white,
    // width: '90%',
  },

  filterContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15
  },
  filterText: {
    color: colors.lightGreen,
    fontSize: 18,
    paddingHorizontal: 10,
    textAlign: 'center',
    paddingTop: 3,
    fontWeight: '500',
  },
  daterangeText: {
    fontSize: 14,
    color: colors.lightGreen,
    marginTop: 3,
    fontWeight: '600'
  },
  allfilterView: {
    flexDirection: 'row',
  },
  filterSelectView: {
    paddingHorizontal: 16,
    marginTop: 10,
    borderRadius: 24,
    paddingVertical: 8,
    marginRight: 8
},
filterSelect: {
    fontSize: 14,
    // color: COLORS.lightGreen,
    // marginTop:3,
    fontWeight: '400',
    // opacity: 0.7

},
  filterTouchView: {
    backgroundColor: colors.white,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 15, marginBottom: 10
  },
  monthContainer: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 5
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    borderRadius: 4,
    // height: ms(6),
    marginVertical: 6,
    // backgroundColor: "#e6e4e5",
    alignItems: 'center'
  },
  dateText2: {
    color: colors.lightGreen,
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.7,
    marginVertical: 10
  },
  placholderdateText: {
    color: colors.lightGreen,
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.7,
    paddingHorizontal: 10,
  },
  submitButton: {
    height: 29,
    width: 87,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginVertical: 12,
    alignSelf: 'flex-end',
    marginHorizontal: 30,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700'
},


overlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContainer: {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  paddingVertical: 15,
  paddingHorizontal: '5%',
  elevation: 5,
  width: '88%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.5,
},
modalTitle: {
  fontSize: 16,
  color: '#000',
  fontWeight: '600',
  textAlign: 'center',
},
separator: {
  height: 1,
  width: '100%',
  backgroundColor: 'gray',
  marginVertical: 8,
},
itemRow: {
  paddingVertical: 4,
},
itemText: {
  fontSize: 14,
  color: '#333',
},
valueText: {
  fontWeight: '500',
  color: '#000',
},
});
export default styles;
