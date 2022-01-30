import PhoneInput from'react-phone-number-input'
import DatePicker from 'react-date-picker'

const PersonToAlert = (props) => {
    return (
        <>
        <div className="flex space-x-3">
            <PhoneInput
                placeholder="Enter phone number"
                value={props.phoneNum}
                onChange={(e) => props.phoneNumChange(e, props.index)}
            />
            
            <DatePicker
                value={props.dateTime}
                onChange={(e) => props.dateTimeChange(e, props.index)}
            />
            <button onClick={() => props.removeSelf(props.index)}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>
        </>
    )
}

export default PersonToAlert
