'use client';
import { useState } from "react";
import Papa from "papaparse";
import { z } from "zod";

import { accountResponse } from "@/repositorys/accounts/types";

// バリデーションエラーの型定義
interface ValidationError {
  row: number;
  errors: string[];
}

// CSVの各フィールドに対応する型を定義
const CsvDataSchema = z.object({
  "取引日": z.string(),
  "出金金額（円）": z.string(),
  "入金金額（円）": z.string(),
  "海外出金金額": z.string(),
  "通貨": z.string(),
  "変換レート（円）": z.string(),
  "利用国": z.string(),
  "取引内容": z.string(),
  "取引先": z.string(),
  "取引方法": z.string(),
  "支払い区分": z.string(),
  "利用者": z.string(),
  "取引番号": z.string(),
}).refine(
  (data) => {
    // 出金金額と入金金額の少なくとも一方は値が入っている必要がある
    return data["出金金額（円）"] !== "" || data["入金金額（円）"] !== "";
  },
  { message: "出金金額または入金金額のいずれかを入力してください" }
);

type CsvData = z.infer<typeof CsvDataSchema>;

export default function CSVUploaderForm(
  { accounts }: { accounts: accountResponse }
) {
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValidationErrors([]);

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      if (!target) return;
      const csv = target.result as string;

      // CSVをパース
      const { data: parsedData, errors: parseErrors } = Papa.parse<CsvData>(csv, { 
        header: true,
        skipEmptyLines: true
      });

      if (parseErrors.length > 0) {
        setValidationErrors([{
          row: 0,
          errors: ["CSVファイルの形式が不正です"]
        }]);
        return;
      }

      // 各行のバリデーション
      const errors: ValidationError[] = [];
      const validData: CsvData[] = [];
      parsedData.forEach((row, index) => {
        const validation = CsvDataSchema.safeParse(row);
        
        if (!validation.success) {
          errors.push({
            row: index + 1,
            errors: validation.error.errors.map(err => err.message)
          });
        } else {
          validData.push(validation.data);
        }
      });

      if (errors.length > 0) {
        setValidationErrors(errors);
        setCsvData([]);
      } else {
        setValidationErrors([]);
        setCsvData(validData);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async(event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError("ファイルが選択されていません。");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("account", event.currentTarget.account.value);

    try {
      const response = await fetch("/api/v1/csv", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("API応答:", result);
      alert("データの送信が完了しました。");
      window.location.reload(); // 現在のページをリロード
    } catch (error) {
      console.error("送信エラー:", error);
      setError("データの送信中にエラーが発生しました。");
      alert("データの送信中にエラーが発生しました。");
    }
  };

  return (
    <div>
      <h2>CSV Uploader</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="account" className="block mb-2">口座の選択:</label>
          <select 
            id="account" 
            name="account" 
            className="w-full p-2 border rounded"
            required
          >
            <option value="">口座を選択してください</option>
            {accounts.accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="csvFile" className="block mb-2">CSVファイル:</label>
          <input 
            id="csvFile"
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload}
            className="w-full p-2 border rounded" 
            required
          />
        </div>

        {validationErrors.length > 0 && (
          <div className="text-red-600 p-4 bg-red-50 rounded">
            <h4 className="font-bold">バリデーションエラー:</h4>
            <ul className="list-disc pl-5">
              {validationErrors.map((error, index) => (
                <li key={index}>
                  行 {error.row}: {error.errors.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <div style={{ color: "red" }}>{error}</div>}
        {csvData.length > 0 && (
          <div>
          {csvData.length > 0 && (
            <div>
              <h3 className="mb-2">CSV Data:</h3>
              <div className="overflow-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      {Object.keys(csvData[0]).map((key) => (
                        <th key={key} className="px-4 py-2 border border-gray-300 text-left text-sm font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 border border-gray-300 text-sm">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>
        )}
        <br />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={validationErrors.length > 0 || !selectedFile}
        >
          送信
        </button>
      </form>
    </div>
  );
}
