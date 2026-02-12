import { useState } from 'react';

/**
 * useVeloraModal - Hook for managing VeloraModal state
 * 
 * Usage:
 * const modal = useVeloraModal();
 * 
 * // Show success modal
 * modal.showSuccess('Success!', 'Your action was completed successfully.');
 * 
 * // Show error modal
 * modal.showError('Error', 'Something went wrong.');
 * 
 * // Show warning modal
 * modal.showWarning('Warning', 'Please review your input.');
 * 
 * // Show info modal
 * modal.showInfo('Info', 'Here is some information.');
 * 
 * // Show custom modal with buttons
 * modal.show({
 *   type: 'warning',
 *   title: 'Delete Item?',
 *   message: 'This action cannot be undone.',
 *   primaryButtonText: 'Delete',
 *   secondaryButtonText: 'Cancel',
 *   onPrimaryPress: () => handleDelete(),
 * });
 */
export const useVeloraModal = () => {
    const [modalState, setModalState] = useState({
        visible: false,
        type: 'info',
        title: '',
        message: '',
        primaryButtonText: 'OK',
        secondaryButtonText: '',
        onPrimaryPress: null,
        onSecondaryPress: null,
    });

    const show = (config) => {
        setModalState({
            visible: true,
            type: config.type || 'info',
            title: config.title || '',
            message: config.message || '',
            primaryButtonText: config.primaryButtonText || 'OK',
            secondaryButtonText: config.secondaryButtonText || '',
            onPrimaryPress: config.onPrimaryPress || null,
            onSecondaryPress: config.onSecondaryPress || null,
        });
    };

    const hide = () => {
        setModalState((prev) => ({ ...prev, visible: false }));
    };

    const showSuccess = (title, message, onPress) => {
        show({
            type: 'success',
            title,
            message,
            onPrimaryPress: onPress,
        });
    };

    const showError = (title, message, onPress) => {
        show({
            type: 'error',
            title,
            message,
            onPrimaryPress: onPress,
        });
    };

    const showWarning = (title, message, onPress) => {
        show({
            type: 'warning',
            title,
            message,
            onPrimaryPress: onPress,
        });
    };

    const showInfo = (title, message, onPress) => {
        show({
            type: 'info',
            title,
            message,
            onPrimaryPress: onPress,
        });
    };

    const showConfirm = (title, message, onConfirm, onCancel) => {
        show({
            type: 'warning',
            title,
            message,
            primaryButtonText: 'Confirm',
            secondaryButtonText: 'Cancel',
            onPrimaryPress: onConfirm,
            onSecondaryPress: onCancel,
        });
    };

    return {
        modalState,
        show,
        hide,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirm,
    };
};
