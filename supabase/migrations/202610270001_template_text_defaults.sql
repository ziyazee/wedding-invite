CREATE TABLE template_text_defaults (
  template_id integer PRIMARY KEY REFERENCES invitation_templates(id),
  text_layout jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE template_text_defaults ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read template defaults"
  ON template_text_defaults FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upsert template defaults"
  ON template_text_defaults FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
