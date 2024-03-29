import { FocusEvent, KeyboardEvent, SetStateAction } from "react"

import { useRouter } from "next/navigation"
import { URLSearchParams } from "url"

type RangeProps = {
  setter: (
    value: SetStateAction<{
      min: number
      max: number
    }>
  ) => void
  param: { min: number; max: number }
  paramName: Sizes
  sign: SizeSigns
  searchParams: URLSearchParams
  pathname: string
  range: { lowest: number; highest: number }
  tl: {
    from: string
    to: string
  }
}

export default function FilterRange({
  setter,
  param,
  paramName,
  sign,
  searchParams,
  pathname,
  range,
  tl,
}: RangeProps) {
  const router = useRouter()
  function setParams(
    event: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>,
    value: "min" | "max"
  ) {
    if ("key" in event && event.key !== "Enter") return

    const val = value === "min" ? param.min : param.max

    searchParams.delete("page")

    if (value === "min") {
      if (val === Number(searchParams.get(`min${sign}`))) return
      if (val <= param.max && val >= range.lowest) {
        searchParams.set(`${value}${sign}`, val.toString())
      } else if (val < range.lowest || val === null || isNaN(+val)) {
        setter({
          ...param,
          min: range.lowest,
        })
        searchParams.set(`min${sign}`, range.lowest.toString())
      } else if (val > param.max) {
        setter({
          ...param,
          min: param.max,
        })
        searchParams.set(`min${sign}`, param.max.toString())
      }
      router.push(`${pathname}?${searchParams.toString()}`, { scroll: false })
    } else {
      if (val === Number(searchParams.get(`max${sign}`))) return
      if (val >= param.min && val <= range.highest) {
        searchParams.set(`max${sign}`, val.toString())
      } else if (val > range.highest || val === null || isNaN(+val)) {
        setter({
          ...param,
          max: range.highest,
        })
        searchParams.set(`max${sign}`, range.lowest.toString())
      } else if (val < param.min) {
        setter({
          ...param,
          max: param.min,
        })
        searchParams.set(`max${sign}`, param.min.toString())
      }
      router.push(`${pathname}?${searchParams.toString()}`, { scroll: false })
    }
  }

  return (
    <li className="grid gap-2">
      <h2 className="fluid-lg font-semibold text-textPrimary">{paramName}:</h2>
      <div className="flex gap-1">
        <div className=" px-1">
          <label
            className="text-textSecondary fluid-base"
            htmlFor={`${paramName}-min`}
          >
            {tl.from}:{" "}
          </label>
          <input
            className="w-16 border-2 border-borderThin rounded text-textPrimary"
            id={`${paramName}-min`}
            value={param.min}
            onChange={(e) =>
              setter({
                ...param,
                min: Number(e.target.value.replace(/\D/g, "")),
              })
            }
            onKeyDown={(e) => setParams(e, "min")}
            onBlur={(e) => setParams(e, "min")}
            type="text"
            inputMode="numeric"
          />
        </div>
        <div className="px-1">
          <label
            className="text-textSecondary fluid-base"
            htmlFor={`${param}-min`}
          >
            {tl.to}:{" "}
          </label>
          <input
            className="w-16 border-2 border-borderThin rounded text-textPrimary"
            id={`${paramName}-max`}
            value={param.max}
            onChange={(e) =>
              setter({
                ...param,
                max: Number(e.target.value.replace(/\D/g, "")),
              })
            }
            onKeyDown={(e) => setParams(e, "max")}
            onBlur={(e) => setParams(e, "max")}
            type="text"
            inputMode="numeric"
          />
        </div>
      </div>
    </li>
  )
}
