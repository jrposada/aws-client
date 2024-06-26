import {
    OptionsWithExtraProps,
    SnackbarKey,
    SnackbarMessage,
    VariantType,
    useSnackbar as useCoreSnackbar,
} from 'notistack';
import { useCallback } from 'react';

type Options = <V extends VariantType>(
    options: Omit<
        OptionsWithExtraProps<V> & { message?: SnackbarMessage },
        'autoHideDuration'
    >,
) => SnackbarKey;

export default function useSnackbar() {
    const { enqueueSnackbar, closeSnackbar } = useCoreSnackbar();

    const enqueueAutoHideSnackbar = useCallback<Options>(
        (options) => {
            return enqueueSnackbar({
                ...options,
                autoHideDuration: 2000,
                anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            });
        },
        [enqueueSnackbar],
    );

    return { enqueueSnackbar, enqueueAutoHideSnackbar, closeSnackbar };
}
