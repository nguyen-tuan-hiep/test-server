import IconButton from "@mui/joy/IconButton";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";

// Icons
import CloseRounded from "@mui/icons-material/CloseRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

// Custom
import { useRef } from "react";

export default function SelectFilter({ filterOpt, setFilterOpt, filterOpts }) {
    const filterRef = useRef(null);

    return (
        <Select
            action={filterRef}
            value={filterOpt}
            defaultValue={filterOpt}
            placeholder="Filters"
            onChange={(e, newValue) => setFilterOpt(newValue)}
            startDecorator={<FilterListRoundedIcon />}
            {...(filterOpt && {
                endDecorator: (
                    <IconButton
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                        }}
                        onClick={() => {
                            setFilterOpt(null);
                            filterRef.current?.focusVisible();
                        }}
                    >
                        <CloseRounded />
                    </IconButton>
                ),
                indicator: null,
            })}
        >
            {filterOpts.map((filterOpt) => (
                <Option key={filterOpt} value={filterOpt}>
                    {filterOpt}
                </Option>
            ))}
        </Select>
    );
}
