import Swal from 'sweetalert2/src/sweetalert2';

const default_settings = {
  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey: false,
};

export const showAlert = (title: string, text: string) =>
  Swal.fire({
    title,
    text,
    ...default_settings,
  });

export const showConfirm = (text: string, callback: () => any) =>
  Swal.fire({
    title: 'Are you sure?',
    text,
    confirmButtonText: 'Yes',
    showCancelButton: true,
    cancelButtonText: 'No',
    ...default_settings,
  }).then((result: { isConfirmed: boolean }) => {
    if (result.isConfirmed) {
      callback();
    }
  });
