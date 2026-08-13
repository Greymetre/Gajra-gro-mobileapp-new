import * as Yup from 'yup';

export const KycvalidationSchema = Yup.object({
    gstinNo: Yup.string().matches(
        new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
        'Please enter valid GST number',
    ),
    panNo: Yup.string().matches(
        new RegExp(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/),
        'Please enter valid PAN number',
    ),
    aadharNo: Yup.string()
            .min(12, ({ min }) => `Aadhar number must be ${min} digits`)
            .max(12, ({ max }) => `Aadhar number must be ${max} digits`)
            .matches(
            new RegExp(/^[0-9\b\+\(\)]+$/),
            'Aadhar number contains digits only',
    ),
    otherNo: Yup.string()
      .min(4, ({min}) => `Number must be of at least ${min} length`)
      .max(13, ({max}) => `Number must be of  at most ${max} length`),
    otherName: Yup.string()
      .min(2, ({min}) => `Document Name must be of at least ${min} length`)
      .max(100, ({max}) => `Document Name must be of  at most ${max} length`),
  });