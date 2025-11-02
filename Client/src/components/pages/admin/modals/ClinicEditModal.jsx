import ClinicForm from './ClinicForm';

const ClinicEditModal = ({ clinic, isOpen, onClose, onSuccess }) => {
    return (
        <ClinicForm
            isOpen={isOpen}
            onClose={onClose}
            onSuccess={onSuccess}
            editClinic={clinic}
        />
    );
};

export default ClinicEditModal;
