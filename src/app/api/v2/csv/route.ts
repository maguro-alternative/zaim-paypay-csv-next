import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Papa from "papaparse";
import { z } from "zod";

import nextAuthOptions from "../../auth/[...nextauth]";
import { registerIncomesData } from "@/repositorys/income/hooks-income";
import { Income } from "@/repositorys/income/types";
import { registerPaymentsData } from "@/repositorys/payment/hooks-payment";
import { Payment } from "@/repositorys/payment/types";

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    return NextResponse.json(
      { error: 'ログインが必要です' },
      { status: 401 }
    );
  }
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const account = Number(formData.get('account'));

    // ファイルが存在しない場合のエラーハンドリング
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    // CSVファイルかどうかの判定
    if (!file.type && !file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'CSVファイルのみ対応しています' },
        { status: 400 }
      );
    }

    // ファイルの内容を読み取る
    const text = await file.text();

    // CSV を解析して変数に格納
    const rows = Papa.parse<CsvData>(text, { header: true }).data;

    // スキーマを使用してバリデーションを行う
    const validationResult = rows.map((data) => CsvDataSchema.safeParse(data));
    const hasError = validationResult.some((result) => !result.success);
    
    if (hasError) {
      return NextResponse.json(
        { error: 'Invalid CSV format', details: validationResult },
        { status: 400 }
      );
    }

    // データをZaimに登録
    for (let i = 0; i < rows.length; i++) {
      const day = new Date(rows[i]["取引日"]);
      const formattedDay = `${day.getFullYear()}${day.getMonth() + 1}${day.getDate()}`;
      const genreId = Number(formData.get(`genre_${i}`));
      const categoryId = Number(formData.get(`category_${i}`));
      if (rows[i]["出金金額（円）"] === "-") {
        const incomeData: Income = {
          mapping: i + 1,
          category_id: categoryId,
          amount: Number(rows[i]["入金金額（円）"].replace(/,/g, "")),
          date: formattedDay,
          to_account_id: account,
          place: rows[i]["取引先"],
          comment: rows[i]["取引内容"]
        };
        await registerIncomesData(session, incomeData);
      } else if (rows[i]["入金金額（円）"] === "-") {
        const paymentData: Payment = {
          mapping: i + 1,
          genre_id: genreId,
          category_id: categoryId,
          amount: Number(rows[i]["入金金額（円）"].replace(/,/g, "")),
          date: formattedDay,
          from_account_id: account,
          comment: rows[i]["取引内容"],
          name: rows[i]["取引内容"],
          place: rows[i]["取引先"]
        };
        await registerPaymentsData(session, paymentData);
      }
    }

    return NextResponse.json({
      filename: file.name,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('CSV処理エラー:', error);
    return NextResponse.json(
      { error: 'CSVファイルの処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
