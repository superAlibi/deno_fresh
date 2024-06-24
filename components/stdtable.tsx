import { JSXInternal } from "https://esm.sh/v135/preact@10.19.6/src/jsx.d.ts";

export interface Column<T> {
  title: string;
  key?: keyof T;
  type?: "selection" | "action";
  width?: string;
  render?: (row: T) => JSXInternal.Element;
}
export interface STDTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function STDTable<T extends Record<string, any>>(
  { columns, data }: STDTableProps<T>,
) {
  const labels = columns.map((column) => column.title);
  return (
    <table>
      <thead>
        <tr>
          {labels.map((label) => <th>{label}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          return (
            <tr>
              {columns.map((column) => {
                if (column.type === "selection") {
                  return (
                    <td>
                      {/* <input type="hidden" name="" /> */}
                      <input type="checkbox" />
                    </td>
                  );
                } else if (column.type === "action") {
                  if (column.render) {
                    return (
                      <td>
                        {column.render(row)}
                      </td>
                    );
                  } else {
                    return null;
                  }
                } else {
                  return <td>{column.key?row[column.key]:null}</td>;
                }
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default STDTable;
