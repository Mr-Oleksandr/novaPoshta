import React,{ useState, useEffect } from 'react';
import AsyncSelect, { components } from "react-select";
import { useController } from "react-hook-form";
import { novaPoshtaAPI } from "./API";

const MenuList = ({ children, ...props }) => {
    const limit = 100;
    const limitChildren = React.Children.count(children) > limit ? limit : React.Children.count(children);
    const newChildren = [];
    for (let i = 0; i < limitChildren; i++) {
        newChildren.push(children[i]);
    }

    return (
        <components.MenuList {...props}>
            {newChildren}
        </components.MenuList>
    )
}

const SelectedCity = ({ control, name }) => {
    const { field: { onChange } } = useController({ name, control, rules: { required: 'Some error' } })
    const [options, setOptions] = useState([]);
    useEffect(() => {
        loadOptions();
    }, [])

    const loadOptions = async () => {
        try {
            const { data: { data } }  = await novaPoshtaAPI.post(``,{
                modelName: 'Address',
                calledMethod: 'getCities',
            });
            const dataOptions = data.map(({ Description, Ref }) => (
                {
                    label: Description,
                    value: Ref
                }
            ));
            setOptions(dataOptions);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <AsyncSelect
                isClearable
                options={options}
                components={{
                    MenuList,
                }}
                onChange={onChange}
            />
        </div>
    );
};

export default SelectedCity;
