"use client";

import { Search } from "lucide-react";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Field,
  Input,
  Pagination,
  SegmentedControl,
  Stack,
  Switch,
  Tabs,
} from "@merid/react";

export function RtlPreview() {
  return (
    <div dir="rtl" lang="ar" style={{ width: "100%", maxWidth: 460 }}>
      <Stack gap={4}>
        <Breadcrumb.Root>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#">الرئيسية</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>المشاريع</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.Root>
        <Field label="البحث" description="ابحث بالاسم أو المعرّف.">
          <Input leading={<Search size={14} aria-hidden />} placeholder="ابحث…" />
        </Field>
        <Checkbox defaultChecked>تذكرني</Checkbox>
        <Switch defaultChecked>الإشعارات</Switch>
        <Tabs.Root defaultValue="a">
          <Tabs.List aria-label="أقسام">
            <Tabs.Trigger value="a">عام</Tabs.Trigger>
            <Tabs.Trigger value="b">الأعضاء</Tabs.Trigger>
            <Tabs.Trigger value="c">الفوترة</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <SegmentedControl
          aria-label="العرض"
          defaultValue="list"
          options={[
            { value: "list", label: "قائمة" },
            { value: "grid", label: "شبكة" },
          ]}
        />
        <Alert tone="info" title="ملاحظة">
          يتم حفظ التغييرات تلقائيًا.
        </Alert>
        <Pagination pageCount={8} defaultPage={3} previousLabel="السابق" nextLabel="التالي" />
        <Stack direction="row" gap={2}>
          <Button variant="primary">حفظ</Button>
          <Button>إلغاء</Button>
        </Stack>
      </Stack>
    </div>
  );
}
