'use client';
import { useState } from "react";
import Papa from "papaparse";
import { z } from "zod";

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
});

type CsvData = z.infer<typeof CsvDataSchema>;

export default function CSVUploader() {
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);  // ファイルを状態として保存

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      if (!target) return;
      const csv = target.result as string;

      // CSV を解析して変数に格納
      const parsedData = Papa.parse<CsvData>(csv, { header: true }).data;

      // バリデーション
      const validationResult = parsedData.map((data) => CsvDataSchema.safeParse(data));
      const hasError = validationResult.some((result) => !result.success);

      if (hasError) {
        setError("CSVデータにエラーがあります。");
        console.error(validationResult);
      } else {
        setError(null);
        setCsvData(parsedData);
        console.log(parsedData);
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

    try {
      const response = await fetch("/api/csv", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("API応答:", result);
    } catch (error) {
      console.error("送信エラー:", error);
      setError("データの送信中にエラーが発生しました。");
    }
  };

  return (
    <div>
      <h2>CSV Uploader</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        {error && <div style={{ color: "red" }}>{error}</div>}
        {csvData.length > 0 && (
          <div>
            <h3>CSV Data:</h3>
            <pre>{JSON.stringify(csvData, null, 2)}</pre>
          </div>
        )}
        <br />
        <input type="submit" />
      </form>
    </div>
  );
}
